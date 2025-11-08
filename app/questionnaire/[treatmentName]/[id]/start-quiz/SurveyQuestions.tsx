"use client";

import Link from "next/link";
import Script from "next/script";
import { useMemo, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

type Props = {
  treatmentName: string;
  id: string;
};

type Question = {
  key: string;
  question: string;
  type: "MCQs" | "date_input" | "input" | "weight_input" | "Textarea";
  choices?: string[];
  placeholder?: string;
  description?: string;
  checkbox?: boolean;
  image?: boolean;
};

type AnswerValue = string | number | boolean | Date | null | undefined;
type Answers = Record<string, AnswerValue> & {
  medicare_expiry?: Date | null;
};

const LS_KEY =
  process.env.NEXT_PUBLIC_SURVEY_LOCAL_STORAGE_KEY || "SURVEY_PROGRESS";
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function SurveyQuestions({ treatmentName, id }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const tokenFromUrl = search.get("token") ?? "";
  const referralFromUrl = search.get("referral_code") ?? "";
  const firstNameFromUrl = search.get("first_name") ?? "";
  const lastNameFromUrl = search.get("last_name") ?? "";
  const emailFromUrl = search.get("email") ?? "";
  const phoneFromUrl = search.get("phone") ?? "";

  const [token, setToken] = useState<string>(tokenFromUrl);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);
  const [surveySaved, setSurveySaved] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [referralCodeLocked, setReferralCodeLocked] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [surveyLoading, setSurveyLoading] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string>("");
  const [medicareCheckbox, setMedicareCheckbox] = useState<boolean>(false);
  const [medicineCheckbox, setMedicineCheckbox] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: firstNameFromUrl,
    lastName: lastNameFromUrl,
    email: emailFromUrl,
    phone: formatAustralianPhone(phoneFromUrl || "+61 "),
    address: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    state: "",
    postcode: "",
    referral_code: referralFromUrl,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Places Autocomplete
  const places = usePlacesAutocomplete({
    callbackName: "initMap",
    requestOptions: {
      types: ["address"],
      componentRestrictions: { country: "au" },
    },
    debounce: 300,
  });
  const { ready, value, setValue, clearSuggestions, suggestions } = places;
  const { status, data } = suggestions;

  const prettyName = useMemo(() => {
    try {
      if (!treatmentName) return "";
      return decodeURIComponent(treatmentName)
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    } catch {
      return treatmentName;
    }
  }, [treatmentName]);

  // Load questions from API
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await (
          await import("@/lib/api")
        ).httpGet<Question[]>("/initial-questionnaire");
        if (!cancelled && Array.isArray(res)) {
          setQuestions(res);
          setAnswers((prev) => {
            if (Object.keys(prev).length > 0) return prev;
            const init: Answers = {};
            for (const q of res) init[q.key] = "";
            return init;
          });
        }
      } catch {
        router.push("/page/error");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Lock referral code when coming from URL
  useEffect(() => {
    if (referralFromUrl) setReferralCodeLocked(true);
  }, [referralFromUrl]);

  // Generate token and normalize URL with required params
  useEffect(() => {
    let t = tokenFromUrl;
    if (!t) t = generateToken();
    setToken(t);

    const params = new URLSearchParams(search.toString());
    params.set("token", t);
    if (referralFromUrl) params.set("referral_code", referralFromUrl);
    if (firstNameFromUrl) params.set("first_name", firstNameFromUrl);
    if (lastNameFromUrl) params.set("last_name", lastNameFromUrl);
    if (emailFromUrl) params.set("email", emailFromUrl);
    if (phoneFromUrl) params.set("phone", formatAustralianPhone(phoneFromUrl));
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore saved progress
  useEffect(() => {
    if (!token) return;
    try {
      const saved = localStorage.getItem(`${LS_KEY}_${token}`);
      if (!saved) return;
      const parsed = JSON.parse(saved) as {
        answers: Answers;
        currentQuestion: number;
        timestamp: number;
      };
      setAnswers((prev) => ({ ...prev, ...(parsed.answers || {}) }));
      setCurrentQuestion(parsed.currentQuestion || 0);
    } catch {}
  }, [token]);

  // Persist progress
  useEffect(() => {
    if (!token) return;
    try {
      localStorage.setItem(
        `${LS_KEY}_${token}`,
        JSON.stringify({ answers, currentQuestion, timestamp: Date.now() })
      );
    } catch {}
  }, [token, answers, currentQuestion]);

  // Quiz status flags from URL
  useEffect(() => {
    const statusFlag = search.get("quiz_status");
    if (statusFlag === "done") setSurveySubmitted(true);
    if (statusFlag === "stopped") setShowAlert(true);
    if (statusFlag === "saved") setSurveySaved(true);
  }, [search]);

  // Expiration cleanup (approx 2.4h like original typo or 24h?), keep 24h
  useEffect(() => {
    if (!token) return;
    try {
      const saved = localStorage.getItem(`${LS_KEY}_${token}`);
      if (!saved) return;
      const { timestamp } = JSON.parse(saved);
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) localStorage.removeItem(`${LS_KEY}_${token}`);
    } catch {}
  }, [token]);

  // UI helpers
  function generateToken(): string {
    return Math.random().toString(36).slice(2, 20);
  }

  function formatAustralianPhone(raw: string): string {
    const digits = (raw || "").replace(/\D/g, "");
    if (!digits) return "+61 ";
    if (!digits.startsWith("614") || digits.length < 11) return raw || "+61 ";
    return `+61 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(
      8,
      11
    )}`;
  }

  function isQuestionVisible(index: number): boolean {
    if (!questions[index]) return false;
    if (index === 1 && answers.sex_at_birth === "Male") return false;
    if (index === 6 && answers.has_medical_conditions !== "Yes") return false;
    if (index === 8 && answers.has_family_history !== "Yes") return false;
    if (index === 10 && answers.taking_medications !== "Yes") return false;
    if (index === 12 && answers.has_allergies !== "Yes") return false;
    if (index === 14 && answers.has_additional_info !== "Yes") return false;
    return true;
  }

  function validateNumberInput(value: string, fieldName: string): boolean {
    if (isNaN(Number(value))) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Please enter only a number",
      }));
      return false;
    }
    if (fieldName === "medicare" && value.length > 10) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Medicare number should not exceed 10 digits",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
    return true;
  }

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleAnswer(key: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handlePersonalInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "") : value,
    }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target.value;
    if (!input.startsWith("+61 ")) input = "+61 ";
    let numberPart = input.slice(4).replace(/[^0-9]/g, "");
    if (numberPart.startsWith("0") && numberPart.length > 1)
      numberPart = numberPart[1] + numberPart.slice(2);
    if (numberPart.length > 9) numberPart = numberPart.slice(0, 9);
    const formatted =
      "+61 " + numberPart.replace(/(\d{3})(\d{3})(\d{3})?/, "$1 $2 $3").trim();
    setFormData((prev) => ({ ...prev, phone: formatted }));
  }

  function validateForm(): boolean {
    const e: Record<string, string> = {};
    if (!formData.firstName) e.firstName = "First name is required";
    if (!formData.lastName) e.lastName = "Last name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!isValidEmail(formData.email)) e.email = "Invalid email address";
    if (!formData.phone || formData.phone === "+61 ")
      e.phone = "Phone number is required";
    else if (!formData.phone.startsWith("+61 4"))
      e.phone = "Phone number must start with 4 or 04.";
    else if (formData.phone.length < 12) e.phone = "Invalid Phone number";
    if (!formData.address) e.address = "Address is required";
    if (!formData.streetNumber) e.streetNumber = "Street number is required";
    if (!formData.streetName) e.streetName = "Street name is required";
    if (!formData.suburb) e.suburb = "Suburb is required";
    if (!formData.state) e.state = "State is required";
    if (!formData.postcode) e.postcode = "Postcode is required";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8)
      e.password = "Password must be at least 8 characters long";
    if (!formData.confirmPassword) e.confirmPassword = "Password is required";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleAddressSelect(address: string) {
    setValue(address, false);
    clearSuggestions();
    try {
      type AddressComponent = { long_name: string; types: string[] };
      type GeoResult = { address_components: AddressComponent[] };
      const results = (await getGeocode({ address })) as unknown as GeoResult[];
      setPersonalField("address", address);
      const addressComponents: AddressComponent[] =
        results[0]?.address_components || [];
      const findComponent = (type: string) =>
        addressComponents.find((c) => c.types.includes(type))?.long_name || "";
      const fields = [
        { name: "streetNumber" as const, component: "street_number" },
        { name: "streetName" as const, component: "route" },
        { name: "state" as const, component: "administrative_area_level_1" },
        { name: "suburb" as const, component: "locality" },
        { name: "postcode" as const, component: "postal_code" },
      ];
      fields.forEach((f) =>
        setPersonalField(f.name, findComponent(f.component))
      );
      setIsDropdownVisible(true);
    } catch {
      router.push("/page/error");
    }
  }

  function setPersonalField(name: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      const { httpGet, httpPost } = await import("@/lib/api");
      await httpGet("/sanctum/csrf-cookie");
      await httpPost("/register/guest", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        streetNumber: formData.streetNumber,
        streetName: formData.streetName,
        suburb: formData.suburb,
        state: formData.state,
        postcode: formData.postcode,
        referral_code: formData.referral_code,
      });
      setFormSubmitted(true);
    } catch (error: unknown) {
      const apiErr = error as {
        response?: {
          status?: number;
          data?: { errors?: Record<string, string[]> };
        };
      };
      const status = apiErr?.response?.status;
      if (status === 422) {
        const errs = apiErr.response?.data?.errors || {};
        let msg = "An error occurred.";
        const emailErr = errs.email?.[0];
        const phoneErr = errs.phone?.[0];
        const referralErr = errs.referral_code?.[0];
        if (emailErr && phoneErr) msg = "Email and phone are already used.";
        else if (emailErr) msg = emailErr + "Login to your account instead.";
        else if (phoneErr) msg = phoneErr;
        else if (referralErr) msg = referralErr;
        setBackendError(msg);
      } else {
        setBackendError("Server error. Please try again.");
        router.push("/page/error");
      }
    } finally {
      setFormLoading(false);
    }
  }

  async function handleSubmit() {
    setSurveyLoading(true);
    try {
      const { httpPost } = await import("@/lib/api");
      await httpPost("/register/complete", {
        user_id: null,
        sex_at_birth: answers.sex_at_birth,
        pregnancy_status: answers.pregnancy_status,
        date_of_birth: answers.date_of_birth,
        height: answers.height,
        weight: answers.weight,
        has_medical_conditions: answers.has_medical_conditions,
        medical_conditions_details: answers.medical_conditions_details,
        has_family_history: answers.has_family_history,
        family_history_details: answers.family_history_details,
        taking_medications: answers.taking_medications,
        medications_details: answers.medications_details,
        has_allergies: answers.has_allergies,
        allergies_details: answers.allergies_details,
        has_additional_info: answers.has_additional_info,
        additional_info_details: answers.additional_info_details,
        medicare_number: answers.medicare_number,
        medicare_expiry: answers.medicare_expiry
          ? format(answers.medicare_expiry, "yyyy-MM")
          : null,
        individual_reference_number: answers.individual_reference_number,
        referral_source: answers.referral_source,
        treatment_id: id,
        is_completed: true,
      });
      const params = new URLSearchParams(search.toString());
      params.set("quiz_status", "done");
      setSurveySubmitted(true);
      router.replace(`${pathname}?${params.toString()}`);
      sessionStorage.clear();
      localStorage.removeItem(LS_KEY);
      if (token) localStorage.removeItem(`${LS_KEY}_${token}`);
    } catch {
      router.push("/page/error");
    } finally {
      setSurveyLoading(false);
    }
  }

  async function handleSave() {
    setSurveyLoading(true);
    try {
      const { httpPost } = await import("@/lib/api");
      await httpPost("/register/complete", {
        user_id: null,
        sex_at_birth: answers.sex_at_birth,
        pregnancy_status: answers.pregnancy_status,
        date_of_birth: answers.date_of_birth,
        height: answers.height,
        weight: answers.weight,
        has_medical_conditions: answers.has_medical_conditions,
        medical_conditions_details: answers.medical_conditions_details,
        has_family_history: answers.has_family_history,
        family_history_details: answers.family_history_details,
        taking_medications: answers.taking_medications,
        medications_details: answers.medications_details,
        has_allergies: answers.has_allergies,
        allergies_details: answers.allergies_details,
        has_additional_info: answers.has_additional_info,
        additional_info_details: answers.additional_info_details,
        medicare_number: answers.medicare_number,
        medicare_expiry: answers.medicare_expiry
          ? format(answers.medicare_expiry, "yyyy-MM-01")
          : null,
        individual_reference_number: answers.individual_reference_number,
        referral_source: answers.referral_source,
        treatment_id: id,
        is_completed: false,
      });
      const params = new URLSearchParams(search.toString());
      params.set("quiz_status", "saved");
      setSurveySaved(true);
      router.replace(`${pathname}?${params.toString()}`);
      sessionStorage.clear();
      localStorage.removeItem(LS_KEY);
      if (token) localStorage.removeItem(`${LS_KEY}_${token}`);
    } catch {
      router.push("/page/error");
    } finally {
      setSurveyLoading(false);
    }
  }

  function handleNext() {
    const key = questions[currentQuestion]?.key;
    const isMedicareKey =
      key === "medicare_number" || key === "individual_reference_number";
    if (questions[currentQuestion] && isMedicareKey && !medicareCheckbox) {
      const a15 = String(answers.medicare_number ?? "").trim();
      const a17 = String(answers.individual_reference_number ?? "").trim();
      let hasError = false;
      if (!a15) {
        setErrors((prev) => ({
          ...prev,
          question_15: "Medicare number is required",
        }));
        hasError = true;
      } else if (!/^\d{10}$/.test(a15)) {
        setErrors((prev) => ({
          ...prev,
          question_15: "Medicare number must be 10 digits",
        }));
        hasError = true;
      }
      if (!a17) {
        setErrors((prev) => ({
          ...prev,
          question_17: "Individual Reference Number is required",
        }));
        hasError = true;
      }
      if (hasError) return;
    }

    let nextIndex = currentQuestion + 1;
    if (currentQuestion === 1 && answers.pregnancy_status === "Yes") {
      // stopped flow
      const params = new URLSearchParams(search.toString());
      params.set("quiz_status", "stopped");
      setShowAlert(true);
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }
    while (nextIndex < questions.length && !isQuestionVisible(nextIndex))
      nextIndex++;
    if (nextIndex < questions.length) {
      setCurrentQuestion(nextIndex);
      setProgress(((nextIndex + 1) / questions.length) * 100);
    }
  }

  function handlePrevious() {
    let prevIndex = currentQuestion - 1;
    while (prevIndex >= 0 && !isQuestionVisible(prevIndex)) prevIndex--;
    if (prevIndex >= 0) {
      setCurrentQuestion(prevIndex);
      setProgress(((prevIndex + 1) / questions.length) * 100);
    }
    if (currentQuestion === 18) setCurrentQuestion(prevIndex - 2);
  }

  function renderQuestion(question: Question, index: number) {
    if (index !== currentQuestion) return null;
    if (index === 15) {
      return (
        <div>
          <div className="mb-3 form-outline px-2">
            <h4 className="card-question mt-5">{question.question}</h4>
            <input
              type="text"
              value={String(answers[questions[15].key] ?? "")}
              onChange={(e) => {
                const v = e.target.value;
                if (validateNumberInput(v, "medicare"))
                  handleAnswer(questions[15].key, v);
              }}
              className="w-full rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder={questions[15].placeholder}
              disabled={medicareCheckbox}
            />
            {errors["question_15"] && (
              <small className="text-[13px] text-[var(--destructive)]">
                {errors["question_15"]}
              </small>
            )}
            {questions[15].description && (
              <p className="text-sm text-gray-500 mt-1">
                {questions[15].description}
              </p>
            )}
          </div>
          <div className="mb-3 form-outline px-2">
            <h4 className="card-question mt-5">{questions[16].question}</h4>
            <DatePicker
              selected={(answers.medicare_expiry as Date) || null}
              onChange={(date) => {
                if (date) handleAnswer("medicare_expiry", date as Date);
                else handleAnswer("medicare_expiry", null);
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="MM/YYYY"
              minDate={new Date()}
              className="form-control border rounded px-2 py-2 w-full"
              disabled={medicareCheckbox}
            />
            {errors["question_16"] && (
              <small className="text-[13px] text-[var(--destructive)]">
                {errors["question_16"]}
              </small>
            )}
            {questions[16].description && (
              <p className="text-sm text-gray-500 mt-1">
                {questions[16].description}
              </p>
            )}
          </div>
          <div className="mb-4 form-outline px-2">
            <h4 className="card-question mt-5">{questions[17].question}</h4>
            <input
              type="text"
              value={String(answers[questions[17].key] ?? "")}
              onChange={(e) => {
                const v = e.target.value;
                if (validateNumberInput(v, "question_17"))
                  handleAnswer(questions[17].key, v);
              }}
              className="w-full rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder={questions[17].placeholder}
              disabled={medicareCheckbox}
            />
            {errors["question_17"] && (
              <small className="text-[13px] text-[var(--destructive)]">
                {errors["question_17"]}
              </small>
            )}
            {questions[17].description && (
              <p className="text-sm text-gray-500 mt-1">
                {questions[17].description}
              </p>
            )}
          </div>
          {question.image && (
            <div className="mt-2">
              {/* Replace CRA require image with a static example */}
              <img
                src="/images/hero_image_cream.jpg"
                alt="IRN Description"
                width="210"
              />
            </div>
          )}
          {question.checkbox && (
            <div className="mt-2 px-2">
              <input
                type="checkbox"
                id={`checkbox-${index}`}
                className="mr-2 questionCheckbox"
                checked={medicareCheckbox}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setMedicareCheckbox(checked);
                  if (checked) {
                    setAnswers((prev) => ({
                      ...prev,
                      [questions[15].key]: "",
                      [questions[16].key]: "",
                      [questions[17].key]: "",
                    }));
                    setErrors((prev) => {
                      const { question_15, question_16, question_17, ...rest } =
                        prev;
                      return rest;
                    });
                  }
                }}
              />
              <label
                htmlFor={`checkbox-${index}`}
                className="px-1"
              >
                I’ll have these ready for the consultation.
              </label>
            </div>
          )}
        </div>
      );
    }

    if (index === 16 || index === 17) return null;

    switch (question.type) {
      case "MCQs":
        return (
          <div className="mb-4">
            <h4 className="card-question mt-5">{question.question}</h4>
            <ul className="card-list">
              {(question.choices || []).map((choice, choiceIndex) => (
                <li
                  key={choiceIndex}
                  onClick={() => handleAnswer(question.key, choice)}
                  className={`cursor-pointer mb-2 px-4 py-2 rounded ${
                    answers[question.key] === choice
                      ? "bg-blue-500 selected-answer"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="radioBtn"></div>
                  {choice}
                </li>
              ))}
            </ul>
          </div>
        );
      case "date_input": {
        const today = new Date();
        const maxDate = new Date(today.setFullYear(today.getFullYear() - 18))
          .toISOString()
          .split("T")[0];
        return (
          <div className="mb-4 form-outline">
            <h4 className="card-question mt-5">{question.question}</h4>
            <input
              type="date"
              max={maxDate}
              value={String(answers[question.key] ?? "")}
              onChange={(e) => handleAnswer(question.key, e.target.value)}
              className="w-full rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
        );
      }
      case "input":
      case "weight_input":
        return (
          <div className="mb-4 form-outline">
            <h4 className="card-question mt-5">{question.question}</h4>
            <input
              type="text"
              value={String(answers[question.key] ?? "")}
              onChange={(e) => {
                const v = e.target.value;
                const isWeight =
                  question.type === "weight_input" ||
                  question.question.toLowerCase().includes("height");
                if (isWeight) {
                  if (
                    validateNumberInput(v, `question_${index}`) &&
                    !isNaN(Number(v))
                  )
                    handleAnswer(question.key, v);
                } else {
                  handleAnswer(question.key, v);
                }
              }}
              className="w-full rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder={question.placeholder}
            />
          </div>
        );
      case "Textarea":
        return (
          <div className="mb-4 form-outline">
            <h4 className="card-question mt-5">{question.question}</h4>
            <textarea
              value={String(answers[question.key] ?? "")}
              onChange={(e) => handleAnswer(question.key, e.target.value)}
              className="w-full rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder={question.placeholder}
              rows={5}
              cols={55}
              disabled={
                question.key === "medications_details" && medicineCheckbox
              }
              maxLength={1000}
            />
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">
                {question.description}
              </p>
            )}
            {question.checkbox && (
              <div className="mt-2 px-2">
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  className="mr-2 questionCheckbox"
                  checked={medicineCheckbox}
                  onChange={(e) => setMedicineCheckbox(e.target.checked)}
                />
                <label
                  htmlFor={`checkbox-${index}`}
                  className="px-1"
                >
                  I can’t remember. I’ll have these ready for the consultation.
                </label>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  }

  // Screens
  if (surveySubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#007b7f] to-[#009999] flex items-center justify-center text-center">
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-[540px] mx-auto text-white">
            <div className="mb-4">
              <img
                src="/images/hero_image_cream.jpg"
                alt="Illustration"
                width={125}
                className="mx-auto"
              />
            </div>
            <h3 className="mb-4 text-[34px] leading-none font-semibold">
              That’s it! You’re all done.
            </h3>
            <p className="text-white text-[16px] font-light mb-6">
              Thank you for completing the questionnaire. We look forward to
              discussing your {prettyName} health journey in your upcoming
              consultation.
            </p>
            <p className="text-[11px] text-gray-200 mb-6">
              After the appointment, your practitioner will be in touch to
              recommend a tailored treatment plan.
            </p>
            <a href="/patient">
              <button className="bg-[#026561] text-white w-full mt-2 font-medium rounded px-4 py-3 hover:opacity-90">
                Login To Your Dashboard
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (surveySaved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#007b7f] to-[#009999] flex items-center justify-center text-center">
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-[540px] mx-auto text-white">
            <h3 className="mb-4 text-[34px] leading-none font-semibold">
              Your Progress Is Saved!
            </h3>
            <p className="text-white text-[16px] font-light mb-6">
              Login anytime to your account to continue your questionnaire for
              the {prettyName} telehealth assessment from where you stopped!
            </p>
            <p className="text-[11px] text-gray-200 mb-6">
              After finishing your questionnaire, your practitioner will be in
              touch to recommend a tailored treatment plan.
            </p>
            <a href="/patient">
              <button className="bg-[#026561] text-white w-full mt-2 font-medium rounded px-4 py-3 hover:opacity-90">
                Login To Your Dashboard
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (showAlert) {
    try {
      if (token) localStorage.removeItem(`${LS_KEY}_${token}`);
      localStorage.removeItem(LS_KEY);
      sessionStorage.clear();
    } catch {}
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#007b7f] to-[#009999] flex items-center justify-center text-center">
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-[540px] mx-auto text-white">
            <h3 className="mb-4 text-[34px] leading-none font-semibold">
              We’re sorry, but Primed Clinic is not the right fit for you at
              this time.
            </h3>
            <p className="text-white text-[14px] font-light mb-6">
              Primed Clinic is not suitable for pregnant women, those
              breastfeeding or planning to become pregnant. Some treatments
              could complicate your pregnancy journey. Please get in touch with
              your GP.
            </p>
            <Link href="/">
              <button className="bg-[#026561] text-white w-full mt-2 font-medium rounded px-4 py-3 hover:opacity-90">
                Return To Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {GOOGLE_KEY ? (
        <Script
          id="gmaps"
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places&callback=initMap`}
          strategy="afterInteractive"
        />
      ) : null}

      {/* Header */}
      {!(!showQuestionnaire && formSubmitted) && (
        <div className="relative mb-12 text-center py-6 w-screen shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {formSubmitted && (
                <div
                  className="popup-preview"
                  ref={dropdownRef}
                >
                  <button
                    onClick={handleSave}
                    className="text-primary underline"
                    aria-label="Save Progress"
                  >
                    Save Your Progress
                  </button>
                </div>
              )}
              <div className="mx-auto max-w-[150px]">
                <Link href="/">
                  <img
                    src="/images/primedclinic-logo.png"
                    alt="Logo"
                    className="w-full"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outside questionnaire intro */}
      {!showQuestionnaire && formSubmitted && (
        <div className="p-6 text-center">
          <div className="inline-block border border-[var(--border)] rounded p-6">
            <p className="mb-4">
              Ready to begin your {prettyName} questionnaire?
            </p>
            <button
              className="bg-[var(--primary-dark)] text-[var(--primary-foreground)] w-full mt-2 font-medium rounded px-4 py-3 hover:opacity-90"
              onClick={() => setShowQuestionnaire(true)}
            >
              Start Questionnaire
            </button>
          </div>
        </div>
      )}

      {/* Main row */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center text-center">
          {!formSubmitted ? (
            <div>
              <form className="max-w-[600px] w-full mx-auto px-4">
                <h3 className="personal-form-title">
                  Where should we send your treatment plan?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-left">
                  <div>
                    <div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                          errors.firstName
                            ? "border-[var(--destructive)]"
                            : "border-[var(--input)]"
                        }`}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handlePersonalInfoChange}
                      />
                      {errors.firstName && (
                        <small className="text-[13px] text-[var(--destructive)]">
                          {errors.firstName}
                        </small>
                      )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                          errors.lastName
                            ? "border-[var(--destructive)]"
                            : "border-[var(--input)]"
                        }`}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handlePersonalInfoChange}
                      />
                      {errors.lastName && (
                        <small className="text-[13px] text-[var(--destructive)]">
                          {errors.lastName}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3 text-left">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                      errors.email
                        ? "border-[var(--destructive)]"
                        : "border-[var(--input)]"
                    }`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handlePersonalInfoChange}
                  />
                  {errors.email && (
                    <small className="text-[13px] text-[var(--destructive)]">
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="mb-3 text-left">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                      errors.phone
                        ? "border-[var(--destructive)]"
                        : "border-[var(--input)]"
                    }`}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+61 4XX XXX XXX"
                  />
                  {errors.phone && (
                    <small className="text-[13px] text-[var(--destructive)]">
                      {errors.phone}
                    </small>
                  )}
                </div>

                <div className="text-left">
                  <div className="mb-3 relative">
                    <input
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        if (!isDropdownVisible) setIsDropdownVisible(false);
                      }}
                      disabled={!ready}
                      placeholder="Residential Address"
                      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                        errors.address
                          ? "border-[var(--destructive)]"
                          : "border-[var(--input)]"
                      }`}
                    />
                    {status === "OK" && value && (
                      <ul
                        className="combobox-list"
                        role="listbox"
                        style={{
                          position: "absolute",
                          zIndex: 20,
                          background: "#fff",
                          width: "100%",
                          border: "1px solid #dee2e6",
                          borderRadius: 4,
                          marginTop: 4,
                          maxHeight: 240,
                          overflowY: "auto",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                        }}
                      >
                        {data.map(
                          ({
                            place_id,
                            description,
                          }: {
                            place_id: string;
                            description: string;
                          }) => (
                            <li
                              key={place_id}
                              role="option"
                              aria-selected={false}
                              className="combobox-option"
                              style={{
                                borderBottom: "1px solid #dee2e6",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "10px center",
                                padding: "10px 0 10px 40px",
                              }}
                              onMouseDown={() =>
                                handleAddressSelect(description)
                              }
                            >
                              {description}
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                  {errors.address && (
                    <small className="text-[13px] text-[var(--destructive)]">
                      {errors.address}
                    </small>
                  )}

                  <div
                    style={{
                      maxHeight: isDropdownVisible ? "500px" : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s ease",
                    }}
                    className="additional-address-fields"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="form-group">
                          <input
                            type="text"
                            name="streetNumber"
                            value={formData.streetNumber}
                            placeholder="Street Number"
                            onChange={handlePersonalInfoChange}
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                              errors.streetNumber
                                ? "border-[var(--destructive)]"
                                : "border-[var(--input)]"
                            }`}
                          />
                          {errors.streetNumber && (
                            <small className="text-[13px] text-[var(--destructive)]">
                              {errors.streetNumber}
                            </small>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="form-group">
                          <input
                            type="text"
                            name="streetName"
                            value={formData.streetName}
                            placeholder="Street Name"
                            onChange={handlePersonalInfoChange}
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                              errors.streetName
                                ? "border-[var(--destructive)]"
                                : "border-[var(--input)]"
                            }`}
                          />
                          {errors.streetName && (
                            <small className="text-[13px] text-[var(--destructive)]">
                              {errors.streetName}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="form-group">
                          <input
                            type="text"
                            name="suburb"
                            value={formData.suburb}
                            placeholder="Suburb"
                            onChange={handlePersonalInfoChange}
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                              errors.suburb
                                ? "border-[var(--destructive)]"
                                : "border-[var(--input)]"
                            }`}
                          />
                          {errors.suburb && (
                            <small className="text-[13px] text-[var(--destructive)]">
                              {errors.suburb}
                            </small>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={formData.state}
                            onChange={handlePersonalInfoChange}
                            name="state"
                            placeholder="State"
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                              errors.state
                                ? "border-[var(--destructive)]"
                                : "border-[var(--input)]"
                            }`}
                          />
                          {errors.state && (
                            <small className="text-[13px] text-[var(--destructive)]">
                              {errors.state}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <input
                        type="text"
                        value={formData.postcode}
                        onChange={handlePersonalInfoChange}
                        placeholder="Post Code"
                        name="postcode"
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                          errors.postcode
                            ? "border-[var(--destructive)]"
                            : "border-[var(--input)]"
                        }`}
                      />
                      {errors.postcode && (
                        <small className="text-[13px] text-[var(--destructive)]">
                          {errors.postcode}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                          errors.password
                            ? "border-[var(--destructive)]"
                            : "border-[var(--input)]"
                        }`}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handlePersonalInfoChange}
                      />
                      {errors.password && (
                        <small className="text-[13px] text-[var(--destructive)]">
                          {errors.password}
                        </small>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                          errors.confirmPassword
                            ? "border-[var(--destructive)]"
                            : "border-[var(--input)]"
                        }`}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handlePersonalInfoChange}
                      />
                      {errors.confirmPassword && (
                        <small className="text-[13px] text-[var(--destructive)]">
                          {errors.confirmPassword}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="referral_code"
                        name="referral_code"
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                          errors.referral_code
                            ? "border-[var(--destructive)]"
                            : "border-[var(--input)]"
                        } ${
                          referralCodeLocked
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="Referral code"
                        value={formData.referral_code}
                        onChange={handlePersonalInfoChange}
                        disabled={referralCodeLocked}
                      />
                      {errors.referral_code && (
                        <small className="text-[13px] text-[var(--destructive)]">
                          {String(errors.referral_code)}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {backendError && (
                  <div className="rounded border border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--destructive)] px-3 py-2">
                    {backendError}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full bg-[var(--primary-dark)] text-[var(--primary-foreground)] rounded px-4 py-3 mt-2 hover:opacity-90 ${
                    surveyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleFormSubmit}
                  disabled={formLoading}
                >
                  {formLoading ? "Creating your account..." : "SUBMIT"}
                </button>
              </form>
              <div className="questionnaire-footer">
                <p>
                  Already A Member?
                  <Link
                    href="/login"
                    className="text-[var(--primary)] hover:opacity-80"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            showQuestionnaire && (
              <>
                <div className="survey-card container-fluid">
                  <div className="survey-progress-bar">
                    <div
                      className="survey-progress-bar-line"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="card-content">
                    {questions.map((q, idx) => renderQuestion(q, idx))}
                    <div className="card-bottom flex-right">
                      <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="text-white disabled:opacity-50"
                      >
                        <img
                          src="/images/questionairreBackButton.png"
                          alt="Back Button"
                        />
                      </button>
                      {currentQuestion < questions.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="bg-[var(--primary)] text-white rounded px-4 py-2 disabled:opacity-50"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={surveyLoading}
                          className={`bg-[var(--primary)] text-white rounded px-4 py-2 ${
                            surveyLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {surveyLoading ? "Submitting..." : "Submit"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>

        {/* Side image */}
        {!(!showQuestionnaire && formSubmitted) && (
          <div className="hidden lg:block">
            <img
              src={mapTreatmentToImage(prettyName)}
              alt={prettyName}
              className="w-full rounded-[12px]"
            />
          </div>
        )}
      </div>
    </>
  );
}

function mapTreatmentToImage(name: string): string {
  const m: Record<string, string> = {
    "Weight Loss": "/images/weight_loss1.jpg",
    "Hormone Therapy": "/images/hormone_therapy.jpg",
    "Skin Care": "/images/skin_care.jpg",
  };
  return m[name] || "/images/hero_image_cream.jpg";
}
