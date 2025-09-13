const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
    // 1) ����� ��������� ���������
    [...form.elements].forEach(el => el.setCustomValidity?.(''));
    // 2) �������� ���������� �����������
    if (!form.checkValidity()) {
        e.preventDefault();
        // ������: ��������������� ���������
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('������� ���������� e-mail, ��������
name@example.com');
}
        form.reportValidity(); // �������� ���������� ���������
        // A11y: ��������� ���������� �����
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid',
                !el.checkValidity());
        });
        return;
    }
    // 3) �������� ��������� (��� �������)
    e.preventDefault();
    // ���� ����� ������ <dialog>, ��������� ����:
    document.getElementById('contactDialog')?.close('success');
    form.reset();
});