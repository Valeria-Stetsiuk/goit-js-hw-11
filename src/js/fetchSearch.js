import axios from 'axios';
export class SearchThings {
  baseURL = 'https://pixabay.com/api/';
  params = {
    key: '29870815-2b49dd40947a1693a1716dc8b',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  };
  async getImage(requery) {
    if (requery) {
      this.params.q = requery;
    }

    const config = {
      params: this.params,
    };
    return await axios.get(this.baseURL, config);
  }

  increasePage() {
    this.params.page += 1;
  }

  setPage() {
    this.params.page = 1;
  }
}
