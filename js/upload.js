// Upload portal JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const fileList = document.getElementById('file-list');
    const fileItems = document.getElementById('file-items');
    const submitBtn = document.getElementById('submit-btn');
    const costEstimate = document.getElementById('cost-estimate');
    
    let selectedFiles = [];
    let totalSize = 0;
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
    const MAX_TOTAL_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
    
    // Accepted file types
    const acceptedTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac',
        'audio/flac', 'audio/ogg', 'audio/wma', 'audio/aiff',
        'video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/wmv',
        'video/flv', 'video/webm', 'video/3gpp'
    ];
    
    // Browse button click handler
    browseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.click();
    });
    
    // Upload area click handler
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('border-primary', 'bg-blue-50');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('border-primary', 'bg-blue-50');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('border-primary', 'bg-blue-50');
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
    
    // File input change handler
    fileInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        handleFiles(files);
    });
    
    // Handle selected files
    function handleFiles(files) {
        const validFiles = [];
        const errors = [];
        
        files.forEach(file => {
            // Check file type
            if (!isValidFileType(file)) {
                errors.push(`${file.name}: Unsupported file type`);
                return;
            }
            
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: File too large (max 500MB)`);
                return;
            }
            
            // Check if file already selected
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                errors.push(`${file.name}: File already selected`);
                return;
            }
            
            validFiles.push(file);
        });
        
        // Check total size
        const newTotalSize = totalSize + validFiles.reduce((sum, file) => sum + file.size, 0);
        if (newTotalSize > MAX_TOTAL_SIZE) {
            errors.push('Total file size exceeds 2GB limit');
            return;
        }
        
        // Show errors if any
        if (errors.length > 0) {
            showNotification(errors.join('<br>'), 'error');
        }
        
        // Add valid files
        if (validFiles.length > 0) {
            selectedFiles.push(...validFiles);
            totalSize = newTotalSize;
            updateFileList();
            updateCostEstimate();
            validateForm();
            
            showNotification(`${validFiles.length} file(s) added successfully`, 'success');
        }
    }
    
    // Check if file type is valid
    function isValidFileType(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const audioExtensions = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg', 'wma', 'aiff'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', '3gp'];
        
        return acceptedTypes.includes(file.type) || 
               audioExtensions.includes(fileExtension) || 
               videoExtensions.includes(fileExtension);
    }
    
    // Update file list display
    function updateFileList() {
        if (selectedFiles.length === 0) {
            fileList.classList.add('hidden');
            return;
        }
        
        fileList.classList.remove('hidden');
        fileItems.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'flex items-center flex-1';
            
            const fileIcon = getFileIcon(file);
            const fileName = file.name.length > 50 ? file.name.substring(0, 47) + '...' : file.name;
            
            fileInfo.innerHTML = `
                <i class="fas ${fileIcon} text-primary text-xl mr-3"></i>
                <div>
                    <div class="font-medium text-gray-900">${fileName}</div>
                    <div class="text-sm text-gray-500">${formatFileSize(file.size)}</div>
                </div>
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'text-red-500 hover:text-red-700 transition duration-300';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => removeFile(index));
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            fileItems.appendChild(fileItem);
        });
    }
    
    // Get appropriate icon for file type
    function getFileIcon(file) {
        const type = file.type.toLowerCase();
        
        if (type.startsWith('audio/')) {
            return 'fa-file-audio';
        } else if (type.startsWith('video/')) {
            return 'fa-file-video';
        } else {
            const extension = file.name.split('.').pop().toLowerCase();
            const audioExtensions = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg', 'wma', 'aiff'];
            const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', '3gp'];
            
            if (audioExtensions.includes(extension)) {
                return 'fa-file-audio';
            } else if (videoExtensions.includes(extension)) {
                return 'fa-file-video';
            }
        }
        
        return 'fa-file';
    }
    
    // Remove file from selection
    function removeFile(index) {
        const removedFile = selectedFiles.splice(index, 1)[0];
        totalSize -= removedFile.size;
        updateFileList();
        updateCostEstimate();
        validateForm();
        
        showNotification(`${removedFile.name} removed`, 'warning');
    }
    
    // Update cost estimate
    function updateCostEstimate() {
        if (selectedFiles.length === 0) {
            costEstimate.innerHTML = `
                <p>Upload your files to receive an accurate quote based on audio length and selected services.</p>
                <p class="mt-2 font-semibold">We'll provide a detailed quote within 30 minutes of your submission.</p>
            `;
            return;
        }
        
        const serviceType = document.getElementById('service-type').value;
        const turnaround = document.getElementById('turnaround').value;
        
        let baseRate = 2.25; // Default rate
        
        switch (serviceType) {
            case 'legal':
                baseRate = 2.50;
                break;
            case 'medical':
                baseRate = 2.75;
                break;
            case 'interview':
                baseRate = 2.25;
                break;
            case 'general':
                baseRate = 2.00;
                break;
        }
        
        let multiplier = 1;
        switch (turnaround) {
            case 'express':
                multiplier = 1.5;
                break;
            case 'rush':
                multiplier = 2.0;
                break;
        }
        
        const finalRate = baseRate * multiplier;
        
        costEstimate.innerHTML = `
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <p class="font-semibold text-gray-900">Selected Files:</p>
                    <p class="text-gray-600">${selectedFiles.length} files (${formatFileSize(totalSize)})</p>
                </div>
                <div>
                    <p class="font-semibold text-gray-900">Estimated Rate:</p>
                    <p class="text-gray-600">$${finalRate.toFixed(2)} per audio minute</p>
                </div>
            </div>
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-1"></i>
                    Final pricing will be based on actual audio duration, not file size. 
                    You'll receive a detailed quote within 30 minutes of submission.
                </p>
            </div>
        `;
    }
    
    // Validate form
    function validateForm() {
        const requiredFields = [
            'client-name', 'client-email', 'service-type', 'turnaround'
        ];
        
        const checkboxes = ['confidentiality', 'terms'];
        
        let isValid = true;
        
        // Check required fields
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
            }
        });
        
        // Check email validity
        const email = document.getElementById('client-email').value;
        if (email && !validateEmail(email)) {
            isValid = false;
        }
        
        // Check checkboxes
        checkboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (!checkbox.checked) {
                isValid = false;
            }
        });
        
        // Check if files are selected
        if (selectedFiles.length === 0) {
            isValid = false;
        }
        
        // Update submit button
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.className = 'bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300';
        } else {
            submitBtn.disabled = true;
            submitBtn.className = 'bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed transition duration-300';
        }
    }
    
    // Form submission handler
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Please complete all required fields and upload at least one file.', 'error');
            return;
        }
        
        const hideLoading = showLoading(submitBtn, 'Uploading...');
        
        // Simulate file upload (replace with actual upload logic)
        setTimeout(() => {
            hideLoading();
            
            // Show success message
            showNotification('Files uploaded successfully! You will receive a quote within 30 minutes.', 'success');
            
            // Reset form
            uploadForm.reset();
            selectedFiles = [];
            totalSize = 0;
            updateFileList();
            updateCostEstimate();
            validateForm();
            
            // Redirect to thank you page or show confirmation
            // window.location.href = 'thank-you.html';
            
        }, 3000);
    });
    
    // Listen for form field changes
    const formFields = uploadForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('change', validateForm);
        field.addEventListener('input', validateForm);
    });
    
    // Listen for service type and turnaround changes to update cost estimate
    document.getElementById('service-type').addEventListener('change', updateCostEstimate);
    document.getElementById('turnaround').addEventListener('change', updateCostEstimate);
    
    // Initialize form validation
    validateForm();
    
    console.log('Upload portal initialized successfully');
});