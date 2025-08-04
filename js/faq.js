// FAQ page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Initialize FAQ functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease-out';
        
        // Click handler for questions
        question.addEventListener('click', function() {
            const isOpen = !answer.classList.contains('hidden');
            
            if (isOpen) {
                // Close the answer
                answer.style.maxHeight = '0';
                setTimeout(() => {
                    answer.classList.add('hidden');
                }, 300);
                
                // Rotate icon back
                icon.style.transform = 'rotate(0deg)';
                
                // Update background
                question.classList.remove('bg-gray-100');
            } else {
                // Close other open answers
                closeAllAnswers();
                
                // Open this answer
                answer.classList.remove('hidden');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Rotate icon
                icon.style.transform = 'rotate(180deg)';
                
                // Update background
                question.classList.add('bg-gray-100');
                
                // Scroll to question if it's below the fold
                setTimeout(() => {
                    const questionRect = question.getBoundingClientRect();
                    const navHeight = 80; // Account for fixed navigation
                    
                    if (questionRect.top < navHeight) {
                        window.scrollTo({
                            top: window.pageYOffset + questionRect.top - navHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 350);
            }
        });
        
        // Add hover effects
        question.addEventListener('mouseenter', function() {
            if (!answer.classList.contains('hidden')) return;
            this.classList.add('bg-gray-100');
        });
        
        question.addEventListener('mouseleave', function() {
            if (!answer.classList.contains('hidden')) return;
            this.classList.remove('bg-gray-100');
        });
        
        // Add transition to icon
        icon.style.transition = 'transform 0.3s ease';
    });
    
    // Function to close all answers
    function closeAllAnswers() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            if (!answer.classList.contains('hidden')) {
                answer.style.maxHeight = '0';
                setTimeout(() => {
                    answer.classList.add('hidden');
                }, 300);
                
                icon.style.transform = 'rotate(0deg)';
                question.classList.remove('bg-gray-100');
            }
        });
    }
    
    // Handle category navigation
    const categoryLinks = document.querySelectorAll('a[href^="#"]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add highlight effect to the category
                targetElement.classList.add('highlight-category');
                setTimeout(() => {
                    targetElement.classList.remove('highlight-category');
                }, 2000);
            }
        });
    });
    
    // Add CSS for highlight effect
    const style = document.createElement('style');
    style.textContent = `
        .highlight-category {
            background-color: #dbeafe;
            border-radius: 0.5rem;
            transition: background-color 0.3s ease;
        }
        
        .faq-question {
            cursor: pointer;
        }
        
        .faq-item:hover .faq-question {
            background-color: #f9fafb;
        }
    `;
    document.head.appendChild(style);
    
    // Search functionality (bonus feature)
    function createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'max-w-md mx-auto mb-8';
        searchContainer.innerHTML = `
            <div class="relative">
                <input type="text" id="faq-search" placeholder="Search FAQs..." 
                       class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
        `;
        
        const faqContent = document.querySelector('.py-16.bg-white .max-w-4xl');
        if (faqContent) {
            faqContent.insertBefore(searchContainer, faqContent.firstChild);
            
            const searchInput = document.getElementById('faq-search');
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterFAQs(searchTerm);
            });
        }
    }
    
    // Filter FAQs based on search term
    function filterFAQs(searchTerm) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
                
                // Close if open
                const answer = item.querySelector('.faq-answer');
                const question = item.querySelector('.faq-question');
                const icon = question.querySelector('i');
                
                if (!answer.classList.contains('hidden')) {
                    answer.style.maxHeight = '0';
                    setTimeout(() => {
                        answer.classList.add('hidden');
                    }, 300);
                    
                    icon.style.transform = 'rotate(0deg)';
                    question.classList.remove('bg-gray-100');
                }
            }
        });
        
        // Show/hide category headers based on visible items
        const categories = document.querySelectorAll('[id]');
        categories.forEach(category => {
            if (!category.id) return;
            
            const categoryItems = document.querySelectorAll(`#${category.id} .faq-item`);
            const visibleItems = Array.from(categoryItems).filter(item => 
                item.style.display !== 'none'
            );
            
            if (visibleItems.length === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
    }
    
    // Add search box
    createSearchBox();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close all answers
        if (e.key === 'Escape') {
            closeAllAnswers();
        }
    });
    
    // Auto-open FAQ based on URL hash
    function handleURLHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                // Scroll to the section
                setTimeout(() => {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Highlight the category
                    targetElement.classList.add('highlight-category');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-category');
                    }, 2000);
                }, 100);
            }
        }
    }
    
    // Handle hash changes
    window.addEventListener('hashchange', handleURLHash);
    handleURLHash(); // Initial check
    
    console.log('FAQ functionality initialized successfully');
});