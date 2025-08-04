// File Upload Portal JavaScript for JD Legal Transcripts

document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initUploadForm();
});

// File Upload Functionality
function initFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileList = document.getElementById('fileList');
    const filesContainer = document.getElementById('filesContainer');
    
    let selectedFiles = [];
    
    // Drag and drop events
    if (dropZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area when dragging over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);
        
        // Handle click to browse
        dropZone.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Browse button click
        if (browseBtn) {
            browseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                fileInput.click();
            });
        }
        
        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                handleFiles(this.files);
            });
        }
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('dragover');
    }
    
    function unhighlight() {
        dropZone.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        const validFiles = [];
        const errors = [];
        
        // Validate each file
        [...files].forEach(file => {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });
        
        // Show errors if any
        if (errors.length > 0) {
            showUploadNotification(errors.join('\n'), 'error');
        }
        
        // Add valid files to selection
        if (validFiles.length > 0) {
            validFiles.forEach(file => {
                // Check if file already exists
                const existingFile = selectedFiles.find(f => f.name === file.name && f.size === file.size);
                if (!existingFile) {
                    selectedFiles.push(file);
                }
            });
            
            updateFileList();
            showUploadNotification(`${validFiles.length} file(s) added successfully.`, 'success');
        }
    }
    
    function validateFile(file) {
        const maxSize = 2 * 1024 * 1024 * 1024; // 2GB in bytes
        const allowedTypes = [
            // Audio formats
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 
            'audio/ogg', 'audio/wma', 'audio/aiff', 'audio/amr', 'audio/aac',
            // Video formats
            'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
            'video/x-ms-wmv', 'video/x-flv', 'video/x-matroska', 'video/webm',
            'video/3gpp', 'video/x-ms-asf'
        ];
        
        // Check file size
        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'File size exceeds 2GB limit'
            };
        }
        
        // Check file type by extension if MIME type is not recognized
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();
        const allowedExtensions = [
            'mp3', 'wav', 'm4a', 'flac', 'ogg', 'wma', 'aiff', 'amr', 'aac',
            'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', '3gp', 'asf'
        ];
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            return {
                valid: false,
                error: 'File type not supported. Please upload audio or video files only.'
            };
        }
        
        return { valid: true };
    }
    
    function updateFileList() {
        if (selectedFiles.length === 0) {
            fileList.classList.add('hidden');
            return;
        }
        
        fileList.classList.remove('hidden');
        filesContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = createFileItem(file, index);
            filesContainer.appendChild(fileItem);
        });
    }
    
    function createFileItem(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between';
        
        const fileSize = formatFileSize(file.size);
        const fileName = file.name;
        
        fileItem.innerHTML = `
            <div class="flex items-center flex-1">
                <div class="flex-shrink-0 mr-3">
                    <i class="fas fa-file-audio text-primary-blue text-xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">${fileName}</p>
                    <p class="text-sm text-gray-500">${fileSize}</p>
                </div>
            </div>
            <div class="flex items-center">
                <span class="text-sm text-green-600 mr-3">Ready</span>
                <button class="text-red-600 hover:text-red-800 remove-file" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Remove file functionality
        const removeBtn = fileItem.querySelector('.remove-file');
        removeBtn.addEventListener('click', function() {
            removeFile(index);
        });
        
        return fileItem;
    }
    
    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        showUploadNotification('File removed successfully.', 'info');
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Make selectedFiles available globally for form submission
    window.getSelectedFiles = function() {
        return selectedFiles;
    };
}

// Upload Form Handling
function initUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form fields
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    showFieldError(input, `${getFieldLabel(input)} is required.`);
                    isFormValid = false;
                } else {
                    clearFieldError(input);
                }
            });
            
            // Check if files are selected
            const selectedFiles = window.getSelectedFiles ? window.getSelectedFiles() : [];
            if (selectedFiles.length === 0) {
                showUploadNotification('Please select at least one file to upload.', 'error');
                isFormValid = false;
            }
            
            if (isFormValid) {
                submitUploadForm(this, selectedFiles);
            }
        });
    }
}

function submitUploadForm(form, files) {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Uploading...';
    submitBtn.disabled = true;
    
    // Simulate file upload process
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Upload complete
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Upload Complete!';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showUploadNotification(
                        'Files uploaded successfully! We\'ll begin processing your transcription request immediately and send you updates via email.',
                        'success'
                    );
                    
                    // Reset form and files
                    form.reset();
                    if (window.getSelectedFiles) {
                        // Clear selected files
                        const selectedFiles = window.getSelectedFiles();
                        selectedFiles.length = 0;
                        
                        // Hide file list
                        const fileList = document.getElementById('fileList');
                        if (fileList) {
                            fileList.classList.add('hidden');
                        }
                    }
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 2000);
            }, 500);
        }
    }, 200);
}

// File Upload Notification System
function showUploadNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.upload-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `upload-notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 translate-x-full`;
    
    // Set color based on type
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
    } else if (type === 'info') {
        notification.classList.add('bg-blue-500', 'text-white');
    } else {
        notification.classList.add('bg-gray-500', 'text-white');
    }
    
    // Add content
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-1">
                <p class="text-sm font-medium whitespace-pre-line">${message}</p>
            </div>
            <button class="ml-3 flex-shrink-0 close-upload-notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-upload-notification');
    closeBtn.addEventListener('click', () => {
        closeUploadNotification(notification);
    });
    
    // Auto close after 7 seconds for longer messages
    setTimeout(() => {
        closeUploadNotification(notification);
    }, 7000);
}

function closeUploadNotification(notification) {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Helper functions for form validation
function showFieldError(field, message) {
    field.classList.add('border-red-500', 'bg-red-50');
    field.classList.remove('border-gray-300');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-600 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500', 'bg-red-50');
    field.classList.add('border-gray-300');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.getAttribute('name');
}