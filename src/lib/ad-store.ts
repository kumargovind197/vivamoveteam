
// This is a simple in-memory store for the prototype's ad content.
// In a real app, this data would be fetched from a database (e.g., Firestore).

interface AdContent {
  description: string;
  imageUrl: string;
  targetUrl: string;
}

export let popupAdContent: AdContent = {
  description: 'Ad for ergonomic office chairs',
  imageUrl: 'https://placehold.co/400x300.png',
  targetUrl: '#',
};

export let footerAdContent: AdContent = {
  description: 'Horizontal ad banner for wellness retreats',
  imageUrl: 'https://placehold.co/728x90.png',
  targetUrl: '#',
};

export function setPopupAdContent(newContent: AdContent) {
  popupAdContent = newContent;
}

export function setFooterAdContent(newContent: AdContent) {
  footerAdContent = newContent;
}
