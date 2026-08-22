/* =========================================================
   GAME 3 — MENULIS HURUF
========================================================= */


/*
 * Untuk prototype pertama kita gunakan 5 huruf.
 *
 * Nanti bisa diganti menjadi A-Z.
 */

const WRITING_LETTERS = [

    "A",
    "B",
    "C",
    "D",
    "E"

];


const WritingGame = {


    currentIndex: 0,

    currentLetter: "A",

    drawing: false,

    completedPoints: new Set(),

    progress: 0,

    canvas: null,

    ctx: null,

    dpr: 1,

    points: [],

    elements: {},



    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.cacheElements();

        this.setupCanvas();

        this.bindEvents();

        this.renderStats();

        this.loadLetter();

    },



    /* =====================================================
       CACHE
    ===================================================== */

    cacheElements() {

        this.elements = {

            canvas:
                document.getElementById(
                    "writingCanvas"
                ),

            currentLetter:
                document.getElementById(
                    "currentLetter"
                ),

            letterNumber:
                document.getElementById(
                    "letterNumber"
                ),

            progressFill:
                document.getElementById(
                    "progressFill"
                ),

            traceFill:
                document.getElementById(
                    "traceFill"
                ),

            tracePercent:
                document.getElementById(
                    "tracePercent"
                ),

            canvasHint:
                document.getElementById(
                    "canvasHint"
                ),

            listenButton:
                document.getElementById(
                    "listenButton"
                ),

            resetButton:
                document.getElementById(
                    "resetButton"
                ),

            feedback:
                document.getElementById(
                    "writingFeedback"
                ),

            feedbackIcon:
                document.getElementById(
                    "feedbackIcon"
                ),

            feedbackTitle:
                document.getElementById(
                    "feedbackTitle"
                ),

            feedbackText:
                document.getElementById(
                    "feedbackText"
                ),

            starCount:
                document.getElementById(
                    "starCount"
                ),

            backButton:
                document.getElementById(
                    "backButton"
                ),

            completionModal:
                document.getElementById(
                    "completionModal"
                ),

            repeatGameButton:
                document.getElementById(
                    "repeatGameButton"
                ),

            homeButton:
                document.getElementById(
                    "homeButton"
                ),

            finalLetters:
                document.getElementById(
                    "finalLetters"
                )

        };


        this.canvas =
            this.elements.canvas;


        this.ctx =
            this.canvas.getContext(
                "2d"
            );

    },



    /* =====================================================
       CANVAS SETUP
    ===================================================== */

    setupCanvas() {

        const rect =
            this.canvas.getBoundingClientRect();


        this.dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        this.canvas.width =
            rect.width * this.dpr;


        this.canvas.height =
            rect.height * this.dpr;


        this.ctx.setTransform(
            this.dpr,
            0,
            0,
            this.dpr,
            0,
            0
        );


        window.addEventListener(
            "resize",
            () => {

                this.setupCanvas();

                this.drawTemplate();

            }
        );

    },



    /* =====================================================
       EVENTS
    ===================================================== */

    bindEvents() {


        /*
         * Mouse
         */

        this.canvas.addEventListener(
            "mousedown",
            event => {

                this.startDrawing(
                    event
                );

            }
        );


        this.canvas.addEventListener(
            "mousemove",
            event => {

                this.moveDrawing(
                    event
                );

            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                this.stopDrawing();

            }
        );



        /*
         * Touch / mobile
         */

        this.canvas.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                this.startDrawing(
                    event.touches[0]
                );

            },
            {
                passive: false
            }
        );


        this.canvas.addEventListener(
            "touchmove",
            event => {

                event.preventDefault();

                this.moveDrawing(
                    event.touches[0]
                );

            },
            {
                passive: false
            }
        );


        this.canvas.addEventListener(
            "touchend",
            event => {

                event.preventDefault();

                this.stopDrawing();

            },
            {
                passive: false
            }
        );



        /*
         * Buttons
         */

        this.elements.resetButton
            .addEventListener(
                "click",
                () => {

                    this.resetTracing();

                }
            );


        this.elements.listenButton
            .addEventListener(
                "click",
                () => {

                    this.playLetterSound();

                }
            );


        this.elements.backButton
            .addEventListener(
                "click",
                () => {

                    this.goHome();

                }
            );


        this.elements.repeatGameButton
            .addEventListener(
                "click",
                () => {

                    this.restart();

                }
            );


        this.elements.homeButton
            .addEventListener(
                "click",
                () => {

                    this.goHome();

                }
            );

    },



    /* =====================================================
       LOAD LETTER
    ===================================================== */

    loadLetter() {

        this.currentLetter =
            WRITING_LETTERS[
                this.currentIndex
            ];


        this.elements.currentLetter
            .textContent =
            this.currentLetter;


        this.elements.letterNumber
            .textContent =
            this.currentIndex + 1;


        const percent =
            (
                (this.currentIndex + 1)
                /
                WRITING_LETTERS.length
            ) * 100;


        this.elements.progressFill
            .style.width =
            `${percent}%`;


        this.hideFeedback();


        this.resetTracing(
            false
        );


        /*
         * Suara otomatis tidak dipaksa.
         *
         * Anak bisa menekan
         * tombol Dengarkan.
         */

    },



    /* =====================================================
       DRAW TEMPLATE
    ===================================================== */

    drawTemplate() {

        const width =
            this.canvas.clientWidth;


        const height =
            this.canvas.clientHeight;


        this.ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
         * Background
         */

        this.ctx.fillStyle =
            "#f8fdff";


        this.ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Grid lembut
         */

        this.ctx.strokeStyle =
            "#e7f3f9";


        this.ctx.lineWidth =
            1;


        for (
            let y = 40;
            y < height;
            y += 40
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                0,
                y
            );

            this.ctx.lineTo(
                width,
                y
            );

            this.ctx.stroke();

        }


        /*
         * Huruf
         */

        this.ctx.save();


        this.ctx.font =
            "bold 270px Arial";


        this.ctx.textAlign =
            "center";


        this.ctx.textBaseline =
            "middle";


        /*
         * Shadow putih
         */

        this.ctx.fillStyle =
            "#ffffff";


        this.ctx.fillText(
            this.currentLetter,
            width / 2,
            height / 2 - 8
        );


        /*
         * Garis putus-putus
         */

        this.ctx.strokeStyle =
            "#9ecde5";


        this.ctx.lineWidth =
            5;


        this.ctx.setLineDash([
            8,
            9
        ]);


        this.ctx.strokeText(
            this.currentLetter,
            width / 2,
            height / 2 - 8
        );


        this.ctx.restore();



        /*
         * Start point
         */

        this.drawStartPoint();

    },



    /* =====================================================
       START POINT
    ===================================================== */

    drawStartPoint() {

        const width =
            this.canvas.clientWidth;


        const height =
            this.canvas.clientHeight;


        /*
         * Untuk prototype,
         * titik awal berada di
         * bagian bawah kiri huruf.
         */

        const x =
            width * .38;


        const y =
            height * .67;


        this.ctx.beginPath();


        this.ctx.arc(
            x,
            y,
            12,
            0,
            Math.PI * 2
        );


        this.ctx.fillStyle =
            "#63c878";


        this.ctx.fill();


        this.ctx.beginPath();


        this.ctx.arc(
            x,
            y,
            5,
            0,
            Math.PI * 2
        );


        this.ctx.fillStyle =
            "white";


        this.ctx.fill();

    },



    /* =====================================================
       START DRAWING
    ===================================================== */

    startDrawing(event) {

        const position =
            this.getPointerPosition(
                event
            );


        /*
         * Kita tetap mengizinkan
         * anak memulai dari area huruf.
         */

        if (
            !this.isInsideLetter(
                position.x,
                position.y
            )
        ) {

            return;

        }


        this.drawing = true;


        this.elements.canvasHint
            .classList.add(
                "hidden"
            );


        this.addDrawingPoint(
            position
        );

    },



    /* =====================================================
       MOVE
    ===================================================== */

    moveDrawing(event) {

        if (
            !this.drawing
        ) {

            return;

        }


        const position =
            this.getPointerPosition(
                event
            );


        if (
            !this.isInsideLetter(
                position.x,
                position.y
            )
        ) {

            return;

        }


        this.addDrawingPoint(
            position
        );


        this.updateProgress();

    },



    /* =====================================================
       STOP
    ===================================================== */

    stopDrawing() {

        if (
            !this.drawing
        ) {

            return;

        }


        this.drawing = false;


        /*
         * Kalau progress sudah
         * cukup tinggi,
         * huruf dianggap selesai.
         */

        if (
            this.progress >= 70
        ) {

            this.completeLetter();

        }

    },



    /* =====================================================
       ADD POINT
    ===================================================== */

    addDrawingPoint(position) {

        this.points.push(
            position
        );


        /*
         * Gambar jejak anak
         */

        if (
            this.points.length === 1
        ) {

            return;

        }


        const previous =
            this.points[
                this.points.length - 2
            ];


        this.ctx.save();


        this.ctx.beginPath();


        this.ctx.moveTo(
            previous.x,
            previous.y
        );


        this.ctx.lineTo(
            position.x,
            position.y
        );


        this.ctx.strokeStyle =
            "#63c878";


        this.ctx.lineWidth =
            13;


        this.ctx.lineCap =
            "round";


        this.ctx.lineJoin =
            "round";


        this.ctx.stroke();


        this.ctx.restore();

    },



    /* =====================================================
       POINTER POSITION
    ===================================================== */

    getPointerPosition(event) {

        const rect =
            this.canvas.getBoundingClientRect();


        return {

            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top

        };

    },



    /* =====================================================
       CHECK LETTER
    ===================================================== */

    isInsideLetter(
        x,
        y
    ) {

        /*
         * Prototype sederhana:
         *
         * kita gunakan bounding
         * area huruf.
         *
         * Nanti bisa kita tingkatkan
         * menggunakan path huruf
         * yang lebih presisi.
         */

        const width =
            this.canvas.clientWidth;


        const height =
            this.canvas.clientHeight;


        const centerX =
            width / 2;


        const centerY =
            height / 2;


        const dx =
            Math.abs(
                x - centerX
            );


        const dy =
            Math.abs(
                y - centerY
            );


        return (

            dx <
            width * .35

            &&

            dy <
            height * .42

        );

    },



    /* =====================================================
       UPDATE PROGRESS
    ===================================================== */

    updateProgress() {

        /*
         * Progress berdasarkan
         * jumlah titik.
         *
         * Untuk prototype:
         * 80 titik ≈ selesai.
         */

        const count =
            this.points.length;


        this.progress =
            Math.min(
                100,
                Math.round(
                    count / 0.8
                )
            );


        this.elements.traceFill
            .style.width =
            `${this.progress}%`;


        this.elements.tracePercent
            .textContent =
            `${this.progress}%`;



        /*
         * Feedback ringan
         */

        if (
            this.progress >= 30 &&
            this.progress < 70
        ) {

            this.elements.guideTitle
                .textContent =
                "Bagus! Teruskan! ✏️";

        }

    },



    /* =====================================================
       COMPLETE LETTER
    ===================================================== */

    completeLetter() {

        this.drawing = false;


        this.progress = 100;


        this.elements.traceFill
            .style.width =
            "100%";


        this.elements.tracePercent
            .textContent =
            "100%";


        this.showFeedback();


        /*
         * Reward
         */

        ProgressEngine.addStar(
            1
        );


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();


        AudioEngine.play(
            "correct"
        );


        /*
         * Tunggu sebentar
         * kemudian lanjut huruf berikutnya.
         */

        setTimeout(
            () => {

                this.nextLetter();

            },
            1400
        );

    },



    /* =====================================================
       NEXT LETTER
    ===================================================== */

    nextLetter() {

        this.currentIndex++;


        if (
            this.currentIndex >=
            WRITING_LETTERS.length
        ) {

            this.completeGame();

            return;

        }


        this.loadLetter();

    },



    /* =====================================================
       FEEDBACK
    ===================================================== */

    showFeedback() {

        this.elements.feedback
            .classList.add(
                "show"
            );


        this.elements.feedbackIcon
            .textContent =
            "🎉";


        this.elements.feedbackTitle
            .textContent =
            "Hebat sekali!";


        this.elements.feedbackText
            .textContent =
            `Kamu berhasil mengikuti huruf ${this.currentLetter}!`;

    },


    hideFeedback() {

        this.elements.feedback
            .classList.remove(
                "show"
            );

    },



    /* =====================================================
       RESET
    ===================================================== */

    resetTracing(
        redraw = true
    ) {

        this.drawing = false;


        this.points = [];


        this.progress = 0;


        this.elements.traceFill
            .style.width =
            "0%";


        this.elements.tracePercent
            .textContent =
            "0%";


        this.elements.canvasHint
            .classList.remove(
                "hidden"
            );


        this.hideFeedback();


        this.elements.guideTitle
            .textContent =
            "Ayo menulis! ✏️";


        this.elements.guideText
            .textContent =
            "Ikuti garis huruf dengan jari atau mouse.";


        if (
            redraw
        ) {

            this.drawTemplate();

        } else {

            requestAnimationFrame(
                () => {

                    this.drawTemplate();

                }
            );

        }

    },



    /* =====================================================
       PLAY LETTER
    ===================================================== */

    playLetterSound() {

        if (
            typeof AudioEngine !==
            "undefined"
        ) {

            AudioEngine.playLetter(
                this.currentLetter
            );

        }

    },



    /* =====================================================
       COMPLETE GAME
    ===================================================== */

    completeGame() {

        ProgressEngine.gameCompleted(
            "menulis"
        );


        /*
         * Bonus penyelesaian
         */

        const rewardKey =
            "petualanganHurufMenulisReward";


        if (
            localStorage.getItem(
                rewardKey
            ) !== "true"
        ) {

            ProgressEngine.addStar(
                5
            );


            localStorage.setItem(
                rewardKey,
                "true"
            );

        }


        this.elements.finalLetters
            .textContent =
            WRITING_LETTERS.length;


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();


        AudioEngine.play(
            "reward"
        );


        this.elements.completionModal
            .classList.add(
                "show"
            );

    },



    /* =====================================================
       RESTART
    ===================================================== */

    restart() {

        this.elements.completionModal
            .classList.remove(
                "show"
            );


        this.currentIndex = 0;


        this.resetTracing();


        this.loadLetter();

    },



    /* =====================================================
       HOME
    ===================================================== */

    goHome() {

        AudioEngine.play(
            "click"
        );


        window.location.href =
            "../index.html";

    },



    /* =====================================================
       STATS
    ===================================================== */

    renderStats() {

        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();

    }

};



/* =========================================================
   START GAME
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        WritingGame.init();

    }
);