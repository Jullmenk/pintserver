const cloudinary = require('../config/cloudinary');

const destruirArquivoAnterior = async (url) => {
    const publicIdWithExt = url.split('/upload/')[1];
    const publicIdWithoutVersion = publicIdWithExt.replace(/^v\d+\//, '');
    const publicId = url.slice(-3) === 'pdf' ? decodeURIComponent(publicIdWithoutVersion) : decodeURIComponent(publicIdWithoutVersion.replace(/\.[^/.]+$/, ''));
    await cloudinary.uploader.destroy(publicId, { resource_type: url.slice(-3) === 'pdf' ? 'raw' : 'image' });
  };

  module.exports = {
    destruirArquivoAnterior
  };