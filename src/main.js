const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    if (!form.checkValidity()) {
        e.preventDefault();

        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        form.reportValidity();
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid',
                !el.checkValidity());
        });
        return;
    }

    e.preventDefault()
    document.getElementById('contactDialog')?.close('success');
    form.reset();
});

document.addEventListener('DOMContentLoaded', function() {
    const dialog = document.getElementById('contactDialog');
    const openButton = document.getElementById('openDialog');
    const closeButton = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');

    // Открытие модального окна
    openButton.addEventListener('click', function() {
        dialog.showModal();
    });

    // Закрытие модального окна
    closeButton.addEventListener('click', function() {
        dialog.close();
    });

    // Закрытие при клике вне модального окна
    dialog.addEventListener('click', function(event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    // Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (form.checkValidity()) {
            // Здесь можно добавить отправку данных
            alert('Форма отправлена!');
            dialog.close();
        }
    });
});