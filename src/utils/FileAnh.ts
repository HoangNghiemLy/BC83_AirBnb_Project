export async function imageUrlToBlob(imageUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} from ${imageUrl}`
      );
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error(`Error converting image URL to Blob:`, error);
    return null;
  }
}
