(function() {
    'use strict';
    
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });

    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                if (this.checkValidity()) {
                    event.preventDefault();
                    handleFormSubmit(this);
                }
            });
            
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        this.classList.remove('is-invalid');
                    }
                });
            });
        }
    }
    
    function handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showSuccessMessage();
            form.reset();
            form.classList.remove('was-validated');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    function showSuccessMessage() {
        const alertHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const form = document.getElementById('contactForm');
        form.insertAdjacentHTML('beforebegin', alertHTML);
        
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }
    
    function initCharacterCounter() {
        const messageTextarea = document.getElementById('message');
        const counterElement = document.getElementById('charCounter');
        
        if (messageTextarea && counterElement) {
            messageTextarea.addEventListener('input', function() {
                const maxLength = 1000;
                const currentLength = this.value.length;
                
                counterElement.textContent = `${currentLength}/${maxLength} символов`;
                
                if (currentLength > maxLength * 0.8) {
                    counterElement.classList.add('text-warning');
                } else {
                    counterElement.classList.remove('text-warning');
                }
                
                if (currentLength > maxLength) {
                    counterElement.classList.add('text-danger');
                    this.classList.add('is-invalid');
                } else {
                    counterElement.classList.remove('text-danger');
                    this.classList.remove('is-invalid');
                }
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        initContactForm();
        initCharacterCounter();
    });
    
})();