const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudStorageService {
  constructor() {
    // Configure multer for memory storage
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        // Allow only images
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    });
  }

  // Upload vehicle issue photo to cloud
  async uploadVehiclePhoto(file, taskOrderId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'mto-maintenance/vehicle-issues',
            public_id: `${taskOrderId}-${Date.now()}`,
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ],
            overwrite: true
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                size: result.bytes,
                format: result.format
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload work progress photo
  async uploadWorkPhoto(file, taskOrderId, workLogIndex) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'mto-maintenance/work-progress',
            public_id: `${taskOrderId}-work-${workLogIndex}-${Date.now()}`,
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ],
            overwrite: true
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                size: result.bytes,
                format: result.format
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload completion photo
  async uploadCompletionPhoto(file, taskOrderId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'mto-maintenance/completion',
            public_id: `${taskOrderId}-completion-${Date.now()}`,
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ],
            overwrite: true
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                size: result.bytes,
                format: result.format
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete photo from cloud
  async deletePhoto(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result: result.result
      };
    } catch (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Scheduled cleanup of photos older than 7 days
  async cleanupOldPhotos() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Get list of resources older than 7 days
      const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'mto-maintenance/',
        max_results: 500
      });

      const oldResources = resources.resources.filter(resource => {
        const createdAt = new Date(resource.created_at);
        return createdAt < sevenDaysAgo;
      });

      // Delete old resources
      const deletePromises = oldResources.map(resource => 
        this.deletePhoto(resource.public_id)
      );

      const results = await Promise.all(deletePromises);
      
      return {
        success: true,
        deletedCount: results.filter(r => r.success).length,
        totalFound: oldResources.length
      };
    } catch (error) {
      console.error('Cleanup error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get multer middleware for single file upload
  getUploadMiddleware() {
    return this.upload.single('photo');
  }

  // Get multer middleware for multiple file upload
  getMultipleUploadMiddleware(maxCount = 5) {
    return this.upload.array('photos', maxCount);
  }
}

module.exports = new CloudStorageService();