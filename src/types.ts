export interface GuestbookEntry {
  id?: string;
  name: string;
  guestsCount: number;
  message?: string;
  createdAt: number;
}

export interface InvitationData {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  message: string;
  font: string;
  background: string;
  customBackgroundImage?: string;
  songUrl?: string;
  showPauseButton: boolean;
  isActive: boolean;
  thumbnail_image_url?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const MOCK_INVITATIONS: InvitationData[] = [
  {
    id: "INV-10023",
    groomName: "أحمد",
    brideName: "سارة",
    weddingDate: "2024-10-15",
    weddingTime: "20:00",
    message: "نتشرف بدعوتكم لحضور حفل زفافنا",
    font: "Amiri",
    background: "bg-stone-100",
    showPauseButton: true,
    isActive: true,
  },
  {
    id: "INV-10024",
    groomName: "عمر",
    brideName: "نورة",
    weddingDate: "2024-11-01",
    weddingTime: "19:30",
    message: "بكم تكتمل فرحتنا",
    font: "Cairo",
    background: "bg-orange-50",
    showPauseButton: false,
    isActive: true,
  }
];
