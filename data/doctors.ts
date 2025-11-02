export type Doctor = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
};

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Amelia Hart",
    role: "Hormone Optimization Specialist",
    imageSrc: "/images/Default_Doctor_uncopped_dark_teal_color_mood_0.jpg",
  },
  {
    id: "2",
    name: "Dr. Noah Reid",
    role: "Weight Management Physician",
    imageSrc: "/images/Default_Doctor_uncopped_dark_teal_color_mood_1.jpg",
  },
  {
    id: "3",
    name: "Dr. Sofia Patel",
    role: "Skin Health Consultant",
    imageSrc: "/images/Default_Doctor_uncopped_dark_teal_color_mood_2.jpg",
  },
  {
    id: "4",
    name: "Nurse Olivia Chen",
    role: "Telehealth Lead Nurse",
    imageSrc: "/images/Default_nurse_uncopped_dark_teal_color_mood_0.jpg",
  },
  {
    id: "5",
    name: "Dr. Ethan Miles",
    role: "Performance & Recovery",
    imageSrc:
      "/images/Default_Realistic_full_portrait_of_transition_phases_of_the_sa_1.jpg",
  },
  {
    id: "6",
    name: "Nurse Ava Gomez",
    role: "Sleep & Mood Support",
    imageSrc: "/images/Default_nurse_uncopped_dark_teal_color_mood_1.jpg",
  },
];
