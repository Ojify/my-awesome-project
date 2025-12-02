// main.js - оптимизированный без зависимостей
(function() {
    'use strict';
    
    class PortfolioApp {
        constructor() {
            this.init();
        }
        
        init() {
            this.initNavigation();
            this.initForms();
            this.initModals();
            this.initFilters();
            this.initProgressBars();
            this.initSkipLinks();
            this.initImageLazyLoading();
        }
        
        initNavigation() {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                    navToggle.setAttribute('aria-expanded', !isExpanded);
                    navMenu.classList.toggle('show');
                });
                
                document.addEventListener('click', (event) => {
                    if (!event.target.closest('.main-nav') && navMenu.classList.contains('show')) {
                        navMenu.classList.remove('show');
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Закрытие меню при нажатии на ссылку на мобильных устройствах
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                            navMenu.classList.remove('show');
                            navToggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                });
            }
        }
        
        initForms() {
            const forms = document.querySelectorAll('form[novalidate]');
            forms.forEach(form => this.setupFormValidation(form));
            
            // Инициализация счетчика символов
            const messageTextareas = document.querySelectorAll('textarea[maxlength]');
            messageTextareas.forEach(textarea => this.setupCharacterCounter(textarea));
        }
        
        setupFormValidation(form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                
                if (this.validateForm(form)) {
                    this.handleFormSubmit(form);
                }
            });
            
            // Сброс ошибок при вводе
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
                
                input.addEventListener('blur', () => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        this.showError(input, 'Это поле обязательно для заполнения');
                    }
                });
            });
            
            // Обработка сброса формы
            const resetBtn = form.querySelector('button[type="reset"]');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.resetForm(form);
                });
            }
        }
        
        validateForm(form) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    this.showError(field, 'Это поле обязательно для заполнения');
                    isValid = false;
                } else if (field.type === 'email') {
                    if (!this.validateEmail(field.value)) {
                        this.showError(field, 'Пожалуйста, введите корректный email адрес');
                        isValid = false;
                    }
                }
            });
            
            return isValid;
        }
        
        validateEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
        
        showError(input, message) {
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            
            let errorElement = input.parentElement.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                input.parentElement.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Фокусировка на первом ошибочном поле
            if (!input.hasAttribute('data-focused')) {
                input.focus();
                input.setAttribute('data-focused', 'true');
            }
        }
        
        clearError(input) {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
            input.removeAttribute('data-focused');
            
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        resetForm(form) {
            const errors = form.querySelectorAll('.error-message');
            errors.forEach(error => error.style.display = 'none');
            
            const errorInputs = form.querySelectorAll('.error');
            errorInputs.forEach(input => input.classList.remove('error'));
            
            // Сброс счетчика символов
            const textarea = form.querySelector('textarea[maxlength]');
            if (textarea) {
                const counter = textarea.parentElement.querySelector('.char-counter');
                if (counter) {
                    counter.textContent = `0/${textarea.maxLength} символов`;
                    counter.classList.remove('warning');
                }
            }
        }
        
        async handleFormSubmit(form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const originalDisabled = submitBtn.disabled;
            
            // Показать индикатор загрузки
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            try {
                // Имитация отправки на сервер
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                this.showNotification('success', 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                form.reset();
                
            } catch (error) {
                this.showNotification('error', 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
            } finally {
                // Восстановить исходное состояние кнопки
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = originalDisabled;
            }
        }
        
        setupCharacterCounter(textarea) {
            const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1000;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.setAttribute('aria-live', 'polite');
            counter.setAttribute('aria-atomic', 'true');
            
            textarea.parentElement.appendChild(counter);
            
            const updateCounter = () => {
                const length = textarea.value.length;
                counter.textContent = `${length}/${maxLength} символов`;
                
                if (length > maxLength * 0.8) {
                    counter.classList.add('warning');
                    counter.setAttribute('aria-live', 'assertive');
                } else {
                    counter.classList.remove('warning');
                    counter.setAttribute('aria-live', 'polite');
                }
            };
            
            textarea.addEventListener('input', updateCounter);
            updateCounter(); // Инициализация
        }
        
        initModals() {
            const modalTriggers = document.querySelectorAll('[data-modal]');
            modalTriggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const modalId = trigger.dataset.modal;
                    this.openModal(modalId);
                });
            });
            
            // Закрытие модальных окон
            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('modal-overlay') || 
                    event.target.classList.contains('modal-close') ||
                    event.target.hasAttribute('data-modal-close')) {
                    this.closeModal();
                }
            });
            
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.closeModal();
                }
            });
        }
        
        openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            modal.setAttribute('aria-hidden', 'false');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Фокусировка на первом фокусируемом элементе модального окна
            const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }
        
        closeModal() {
            const modal = document.querySelector('.modal.show');
            if (!modal) return;
            
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        initFilters() {
            const filterContainers = document.querySelectorAll('[data-filter-container]');
            filterContainers.forEach(container => {
                const filterButtons = container.querySelectorAll('[data-filter]');
                const filterItems = container.querySelectorAll('[data-filter-item]');
                
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // Обновление активной кнопки
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        const filterValue = button.dataset.filter;
                        
                        // Фильтрация элементов
                        filterItems.forEach(item => {
                            const itemCategories = item.dataset.filterItem.split(' ');
                            
                            if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                                item.style.display = 'block';
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                    item.style.transform = 'translateY(0)';
                                }, 10);
                            } else {
                                item.style.opacity = '0';
                                item.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    item.style.display = 'none';
                                }, 300);
                            }
                        });
                    });
                });
            });
        }
        
        initProgressBars() {
            const progressBars = document.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                const container = bar.parentElement;
                const value = parseInt(container.getAttribute('aria-valuenow')) || 0;
                
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    bar.style.width = `${value}%`;
                    
                    // Обновление ARIA атрибутов
                    container.setAttribute('aria-valuenow', value);
                    container.setAttribute('aria-valuetext', `${value}% завершено`);
                }, 300);
            });
        }
        
        initSkipLinks() {
            const skipLinks = document.querySelectorAll('.skip-link');
            skipLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                        
                        // Удаление tabindex после потери фокуса
                        targetElement.addEventListener('blur', () => {
                            targetElement.removeAttribute('tabindex');
                        }, { once: true });
                    }
                });
            });
        }
        
        initImageLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback для старых браузеров
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        }
        
        showNotification(type, message) {
            const notification = document.createElement('div');
            notification.className = `alert ${type}`;
            notification.setAttribute('role', 'alert');
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close" aria-label="Закрыть уведомление">&times;</button>
            `;
            
            const mainContent = document.querySelector('.main-content .container') || document.body;
            mainContent.insertBefore(notification, mainContent.firstChild);
            
            // Анимация появления
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
                notification.style.opacity = '1';
            }, 10);
            
            // Закрытие по кнопке
            const closeBtn = notification.querySelector('.alert-close');
            closeBtn.addEventListener('click', () => {
                notification.style.transform = 'translateY(-20px)';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            });
            
            // Автоматическое закрытие
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.transform = 'translateY(-20px)';
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);
        }
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
    
    // Инициализация приложения при загрузке DOM
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
    
    // Экспорт для использования в других скриптах
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PortfolioApp;
    } else {
        window.PortfolioApp = PortfolioApp;
    }
})();