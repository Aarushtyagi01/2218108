

class Url {
  constructor(originalUrl, shortUrl) {
    this.originalUrl = originalUrl;
    this.shortUrl = shortUrl;
    this.createdAt = new Date();
  }
}

module.exports = Url; 