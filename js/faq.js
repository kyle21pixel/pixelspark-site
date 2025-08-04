// FAQ Page JavaScript for JD Legal Transcripts

document.addEventListener('DOMContentLoaded', function() {
    initAccordion();
    initFAQSearch();
    initCategoryFilters();
});

// Accordion Functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');
            const faqItem = this.closest('.faq-item');
            
            // Check if this accordion is currently open
            const isOpen = content.classList.contains('active');
            
            // Close all other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherContent = otherHeader.nextElementSibling;
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    
                    otherContent.classList.remove('active');
                    otherIcon.classList.remove('active');
                }
            });
            
            // Toggle current accordion
            if (isOpen) {
                content.classList.remove('active');
                icon.classList.remove('active');
            } else {
                content.classList.add('active');
                icon.classList.add('active');
                
                // Scroll to the accordion item
                setTimeout(() => {
                    const headerOffset = 100;
                    const elementPosition = faqItem.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
}

// FAQ Search Functionality
function initFAQSearch() {
    const searchInput = document.getElementById('faqSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterFAQs(searchTerm);
        });
        
        // Clear search when escape is pressed
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterFAQs('');
                this.blur();
            }
        });
    }
}

function filterFAQs(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    let visibleCount = 0;
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3').textContent.toLowerCase();
        const answer = item.querySelector('.accordion-content').textContent.toLowerCase();
        
        const isMatch = searchTerm === '' || 
                       question.includes(searchTerm) || 
                       answer.includes(searchTerm);
        
        if (isMatch) {
            item.style.display = 'block';
            visibleCount++;
            
            // Highlight search terms
            if (searchTerm !== '') {
                highlightSearchTerm(item, searchTerm);
            } else {
                removeHighlights(item);
            }
        } else {
            item.style.display = 'none';
            // Close accordion if it's open
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');
            content.classList.remove('active');
            icon.classList.remove('active');
        }
    });
    
    // Show "no results" message if needed
    showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
}

function highlightSearchTerm(item, searchTerm) {
    // Remove existing highlights
    removeHighlights(item);
    
    const question = item.querySelector('h3');
    const answer = item.querySelector('.accordion-content p, .accordion-content');
    
    // Highlight in question
    if (question.textContent.toLowerCase().includes(searchTerm)) {
        question.innerHTML = highlightText(question.textContent, searchTerm);
    }
    
    // Highlight in answer (first paragraph only to avoid highlighting in lists)
    const answerParagraph = answer.querySelector ? answer.querySelector('p') : answer;
    if (answerParagraph && answerParagraph.textContent.toLowerCase().includes(searchTerm)) {
        answerParagraph.innerHTML = highlightText(answerParagraph.textContent, searchTerm);
    }
}

function removeHighlights(item) {
    const highlightedElements = item.querySelectorAll('.search-highlight');
    highlightedElements.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
        parent.normalize();
    });
}

function highlightText(text, searchTerm) {
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight bg-yellow-200 px-1 rounded">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showNoResultsMessage(show) {
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (show) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message text-center py-12 text-gray-500';
            noResultsMessage.innerHTML = `
                <div class="max-w-md mx-auto">
                    <i class="fas fa-search text-4xl mb-4 text-gray-400"></i>
                    <h3 class="text-lg font-semibold mb-2">No results found</h3>
                    <p>Try adjusting your search terms or browse our categories above.</p>
                </div>
            `;
            
            const faqContainer = document.querySelector('.max-w-4xl.mx-auto');
            if (faqContainer) {
                faqContainer.appendChild(noResultsMessage);
            }
        }
        noResultsMessage.style.display = 'block';
    } else {
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Category Filter Functionality
function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-primary-blue', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            this.classList.add('active', 'bg-primary-blue', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Filter FAQs by category
            filterByCategory(category);
            
            // Clear search
            const searchInput = document.getElementById('faqSearch');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Hide no results message
            showNoResultsMessage(false);
        });
    });
}

function filterByCategory(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
            
            // Close accordion if it's open
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');
            content.classList.remove('active');
            icon.classList.remove('active');
        }
        
        // Remove any search highlights
        removeHighlights(item);
    });
    
    // Scroll to FAQ section
    const faqSection = document.querySelector('.py-20.bg-white');
    if (faqSection) {
        const headerOffset = 100;
        const elementPosition = faqSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        
        // Handle accordion headers
        if (target.classList.contains('accordion-header') || target.closest('.accordion-header')) {
            e.preventDefault();
            const header = target.classList.contains('accordion-header') ? target : target.closest('.accordion-header');
            header.click();
        }
        
        // Handle category buttons
        if (target.classList.contains('faq-category-btn')) {
            e.preventDefault();
            target.click();
        }
    }
});

// Add focus styles for keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .accordion-header:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        .faq-category-btn:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        .search-highlight {
            background-color: #fef3c7;
            padding: 0 0.25rem;
            border-radius: 0.25rem;
        }
    `;
    document.head.appendChild(style);
});

// Initialize tooltips for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add helpful tooltips
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.setAttribute('title', 'Search through all FAQ questions and answers');
        searchInput.setAttribute('placeholder', 'Search frequently asked questions...');
    }
    
    // Add aria labels for better accessibility
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach((header, index) => {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', `faq-content-${index}`);
        
        const content = header.nextElementSibling;
        if (content) {
            content.setAttribute('id', `faq-content-${index}`);
            content.setAttribute('role', 'region');
        }
    });
    
    // Update aria-expanded when accordions are toggled
    document.addEventListener('click', function(e) {
        if (e.target.closest('.accordion-header')) {
            const header = e.target.closest('.accordion-header');
            const content = header.nextElementSibling;
            const isExpanded = content.classList.contains('active');
            header.setAttribute('aria-expanded', isExpanded);
        }
    });
});