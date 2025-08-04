// Contact form JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Form validation
    function validateContactForm() {
        const requiredFields = ['first-name', 'last-name', 'email', 'inquiry-type', 'message'];
        let isValid = true;
        const errors = [];
        
        // Check required fields
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();
            
            if (!value) {
                isValid = false;
                field.classList.add('border-red-500');
                errors.push(`${field.labels[0].textContent.replace('*', '').trim()} is required`);
            } else {
                field.classList.remove('border-red-500');
            }
        });
        
        // Validate email
        const emailField = document.getElementById('email');
        const email = emailField.value.trim();
        if (email && !validateEmail(email)) {
            isValid = false;
            emailField.classList.add('border-red-500');
            errors.push('Please enter a valid email address');
        } else if (email) {
            emailField.classList.remove('border-red-500');
        }
        
        // Validate phone if provided
        const phoneField = document.getElementById('phone-contact');
        const phone = phoneField.value.trim();
        if (phone && !validatePhone(phone)) {
            phoneField.classList.add('border-red-500');
            errors.push('Please enter a valid phone number');
        } else {
            phoneField.classList.remove('border-red-500');
        }
        
        return { isValid, errors };
    }
    
    // Update submit button state
    function updateSubmitButton() {
        const { isValid } = validateContactForm();
        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitBtn.classList.add('hover:bg-blue-700');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.classList.remove('hover:bg-blue-700');
        }
    }
    
    // Show/hide project details section based on inquiry type
    const inquiryTypeField = document.getElementById('inquiry-type');
    const projectDetailsSection = document.querySelector('label[for="project-details"]').parentElement;
    
    function toggleProjectDetails() {
        const inquiryType = inquiryTypeField.value;
        if (inquiryType === 'quote') {
            projectDetailsSection.style.display = 'block';
        } else {
            projectDetailsSection.style.display = 'none';
        }
    }
    
    inquiryTypeField.addEventListener('change', toggleProjectDetails);
    toggleProjectDetails(); // Initialize
    
    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', updateSubmitButton);
        field.addEventListener('change', updateSubmitButton);
        field.addEventListener('blur', function() {
            // Remove error styling when user starts typing
            if (this.value.trim()) {
                this.classList.remove('border-red-500');
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const { isValid, errors } = validateContactForm();
        
        if (!isValid) {
            showNotification(errors.join('<br>'), 'error');
            return;
        }
        
        const hideLoading = showLoading(submitBtn, 'Sending...');
        
        // Collect form data
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] = formData.entries()) {
            data[key] = value;
        }
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            hideLoading();
            
            // Determine response based on inquiry type
            let successMessage = 'Thank you for your message! We will respond within 2 hours during business hours.';
            
            if (data['inquiry-type'] === 'quote') {
                successMessage = 'Thank you for your quote request! We will send you a detailed quote within 30 minutes.';
            } else if (data['inquiry-type'] === 'support') {
                successMessage = 'Thank you for contacting support! We will respond within 1 hour to help resolve your issue.';
            }
            
            showNotification(successMessage, 'success');
            
            // Reset form
            contactForm.reset();
            updateSubmitButton();
            toggleProjectDetails();
            
            // Optionally redirect or show additional confirmation
            // window.location.href = 'thank-you.html';
            
        }, 2000);
    });
    
    // Auto-fill service type based on URL parameter (if coming from services page)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    if (serviceParam) {
        const serviceField = document.getElementById('service-needed');
        if (serviceField) {
            serviceField.value = serviceParam;
        }
        
        // Also set inquiry type to quote
        inquiryTypeField.value = 'quote';
        toggleProjectDetails();
    }
    
    // Initialize form state
    updateSubmitButton();
    
    console.log('Contact form initialized successfully');
});