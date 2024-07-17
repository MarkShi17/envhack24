(function() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyD11D5kJMFKiykjIbI0tYFQDsHOx8d_m4M",
        authDomain: "envhack24.firebaseapp.com",
        projectId: "envhack24",
        storageBucket: "envhack24.appspot.com",
        messagingSenderId: "300916206733",
        appId: "1:300916206733:web:3beaadb1eb5dd67bb846c4",
        measurementId: "G-JTPCPH03NM"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const form = document.getElementById('submission-form');
    const tagInput = document.getElementById('tag-input');
    const tagList = document.getElementById('tag-list');
    const addTagButton = document.getElementById('add-tag-button');

    addTagButton.addEventListener('click', () => {
        tagInput.style.display = 'block';
        tagInput.focus();
    });

    tagInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag(tagInput.value);
            tagInput.value = '';
            tagInput.style.display = 'none';
        }
    });

    tagList.addEventListener('click', (event) => {
        if (event.target.tagName === 'SPAN') {
            removeTag(event.target.parentElement);
        }
    });

    function addTag(tag) {
        if (tag && tagList.children.length < 5) {
            const li = document.createElement('li');
            li.textContent = tag;
            const span = document.createElement('span');
            span.textContent = 'x';
            li.appendChild(span);
            tagList.appendChild(li);
        }
    }

    function removeTag(tagElement) {
        tagList.removeChild(tagElement);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = form.title.value;
        const text = form.text.value;
        const tags = Array.from(tagList.children).map(li => li.firstChild.textContent);

        const postData = {
            title,
            text,
            tags
        };

        db.collection('questions').add(postData)
            .then(() => {
                form.reset();
                tagList.innerHTML = '';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
})();