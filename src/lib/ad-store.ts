
// This is a simple in-memory store for the prototype's ad content.
// In a real app, this data would be fetched from a database (e.g., Firestore).

export interface AdContent {
  id: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
}

export let popupAdContents: AdContent[] = [
  {
    id: 'popup-1',
    description: 'Ad for ergonomic office chairs',
    imageUrl: 'https://placehold.co/400x300.png',
    targetUrl: 'https://www.doctors.org.uk',
  },
];

export let footerAdContents: AdContent[] = [
  {
    id: 'footer-1',
    description: 'Horizontal ad banner for wellness retreats',
    imageUrl: 'https://placehold.co/728x90.png',
    targetUrl: 'https://www.doctors.org.uk',
  },
];


// --- Popup Ads Management ---
export function addPopupAd(ad: Omit<AdContent, 'id'>) {
    const newAd = { ...ad, id: `popup-${Date.now()}` };
    popupAdContents.push(newAd);
}

export function updatePopupAd(updatedAd: AdContent) {
    const index = popupAdContents.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) {
        popupAdContents[index] = updatedAd;
    }
}

export function removePopupAd(adId: string) {
    popupAdContents = popupAdContents.filter(ad => ad.id !== adId);
}


// --- Footer Ads Management ---
export function addFooterAd(ad: Omit<AdContent, 'id'>) {
    const newAd = { ...ad, id: `footer-${Date.now()}` };
    footerAdContents.push(newAd);
}

export function updateFooterAd(updatedAd: AdContent) {
    const index = footerAdContents.findIndex(ad => ad.id === updatedAd.id);
    if (index !== -1) {
        footerAdContents[index] = updatedAd;
    }
}

export function removeFooterAd(adId: string) {
    footerAdContents = footerAdContents.filter(ad => ad.id !== adId);
}
