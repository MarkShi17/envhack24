(function() {
    console.log('start');
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
    const auth = firebase.auth();
    const db = firebase.firestore();

    let questions = [];
    let currentUser = null;

    const postElement = document.querySelector('.post');
    const titleElement = document.getElementById('title');
    const questionElement = document.getElementById('question');
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    function fetchQuestions() {
        console.log("access firestone");
        db.collection("question").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                questions.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            //console.log("Loaded questions:", questions);
            if (questions.length === 0) {
                titleElement.textContent = "No Posts Available";
                questionElement.textContent = "You've swiped on all of them!";
            } else {
                showNextQuestion();
            }
        }).catch((error) => {
            console.error("Error:", error);
            titleElement.textContent = "Error loading title";
            questionElement.textContent = "Error loading questions";
        });
    }

    function showNextQuestion() {
        if (questions.length > 0) {
            const question = questions[0];
            titleElement.textContent = question.title;
            questionElement.textContent = question.text;
            postElement.classList.add('enter');
        } else {
            titleElement.textContent = "No more titles available";
            questionElement.textContent = "No more questions available";
        }
    }

    function swipe(direction) {
        if (questions.length > 0) {
            const question = questions[0];
            postElement.classList.remove('enter');
            postElement.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');
            const answer = direction === 'right';
            const response = {
                question_id: question.id,
                user_id: currentUser ? currentUser.uid : 'anonymous',
                answer: answer
            };

            db.collection("responses").add(response).then(() => {
                setTimeout(() => {
                    postElement.classList.remove('swipe-left', 'swipe-right');
                    questions.shift();
                    showNextQuestion();
                }, 500);
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            swipe('left');
        } else if (event.key === 'ArrowRight') {
            swipe('right');
        }
    });

    leftArrow.addEventListener('click', () => {
        swipe('left');
    });

    rightArrow.addEventListener('click', () => {
        swipe('right');
    });

    let startX = 0;

    postElement.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    }, false);

    postElement.addEventListener('touchmove', (event) => {
        if (!startX) return;
        let moveX = event.touches[0].clientX;
        let diffX = startX - moveX;

        if (Math.abs(diffX) > 50) {
            swipe(diffX > 0 ? 'left' : 'right');
            startX = 0;
        }
    }, false);

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            fetchQuestions();
        } else {
            auth.signInAnonymously().then(() => {
                currentUser = auth.currentUser;
                fetchQuestions();
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
    });
})();