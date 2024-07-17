document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html;
                const scripts = contentDiv.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                    const script = document.createElement('script');
                    script.src = scripts[i].src;
                    script.defer = true;
                    document.body.appendChild(script);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                contentDiv.innerHTML = '<p>Error</p>';
            });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    loadPage('swiping.html'); //can change to home/login screen
});
