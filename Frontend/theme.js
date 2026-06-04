(function () {
    const THEME_STORAGE_KEY = "campusTheme";
    const LANGUAGE_STORAGE_KEY = "campusLanguage";
    const NAV_ITEMS = [
        { href: "index.html", key: "home" },
        { href: "about.html", key: "about" },
        { href: "explore.html", key: "explore" },
        { href: "complain.html", key: "complain" },
        { href: "feedback.html", key: "feedback" },
        { href: "contact.html", key: "contact" }
    ];

    const COPY = {
        en: {
            nav: {
                home: "Home",
                about: "About",
                explore: "Explore",
                complain: "Complain",
                feedback: "Feedback",
                contact: "Contact"
            },
            ui: {
                signIn: "Sign In",
                signUp: "Sign Up",
                dark: "Dark",
                light: "Light",
                languageToggle: "Hindi",
                back: "Back",
                goBack: "Go back",
                switchToDark: "Switch to dark mode",
                switchToLight: "Switch to light mode",
                switchToHindi: "Switch to Hindi",
                switchToEnglish: "Switch to English"
            },
            messages: {
                contactInvalid: "Please complete the form correctly.",
                contactSent: "Message sent. We will reply within 24 hours.",
                feedbackSuccess: "Feedback submitted successfully!",
                loginFillAll: "Please fill all fields",
                loginInvalid: "Invalid login details",
                loginDone: "Login done",
                signupFillAll: "Please fill all fields",
                signupMismatch: "Passwords do not match",
                signupDone: "Signup done",
                recoverNoAccount: "No account found with this email",
                recoverUpdated: "Password updated",
                complaintSuccess: "Complaint submitted successfully.",
                sending: "Sending...",
                showDetails: "Show Details",
                hideDetails: "Hide Details",
                hideInfo: "Hide Details",
                showInfo: "Show Details"
            },
            pages: {
                index: {
                    title: "Campus Complaint & Maintenance Portal",
                    subtitle: "Boys Hostel, Girls Hostel<br>and Campus Problems.",
                    description: "View hostel and campus-related issues at NavGurukul and raise a complaint from one place.",
                    primaryAction: "Report Problem",
                    secondaryAction: "View Options",
                    supportBadge: "NavGurukul Support",
                    supportTitle: "Select Your Problem",
                    supportDescription: "Choose a problem category so the hostel or campus support team can receive the update easily.",
                    problemCards: [
                        { title: "Boys Hostel", description: "Room, washroom, and common area issues." },
                        { title: "Girls Hostel", description: "Safety, room, and daily facility issues." },
                        { title: "Campus", description: "Classroom, ground, and campus facility issues." }
                    ],
                    problemMessage: "Hover any problem to see status for Boys Hostel.",
                    sidePanelTitle: "Boys Hostel Problems",
                    sidePanelLabel: "User Problem Panel",
                    searchLabel: "Search Or Write Complaint",
                    searchPlaceholder: "Search issue or write your complaint",
                    galleryBadge: "Campus Gallery",
                    galleryTitle: "NavGurukul Photos",
                    galleryDescription: "View campus and hostel photos here. Click any photo to update the hero image."
                },
                about: {
                    heroBadge: "About the Portal",
                    heroTitle: "Built for faster campus support.",
                    heroDescription: "Report hostel or campus issues, track progress, and get clear updates without the back-and-forth.",
                    primaryAction: "Report a Problem",
                    secondaryAction: "See How It Works",
                    statOneValue: "3",
                    statOneLabel: "simple steps from issue to resolution",
                    statTwoValue: "24/7",
                    statTwoLabel: "ready whenever a student needs help",
                    statThreeValue: "100%",
                    statThreeLabel: "focused on transparency and follow-up",
                    whyBadge: "Why it exists",
                    whyTitle: "A simple place to raise campus issues",
                    whyDescription: "Students should not have to guess who to contact or where their complaint is stuck. This portal keeps the process clear and direct.",
                    featureOneTitle: "Private",
                    featureOneDescription: "Your details stay protected, so you can report issues with confidence.",
                    featureTwoTitle: "Quick Action",
                    featureTwoDescription: "Complaints reach the right support team quickly for review and response.",
                    featureThreeTitle: "Transparent",
                    featureThreeDescription: "Track your complaint clearly and know what is happening at each stage.",
                    processBadge: "How it works",
                    processTitle: "From complaint to resolution in three steps",
                    processDescription: "The flow is intentionally simple so students can submit problems without confusion.",
                    stepOneTitle: "Submit",
                    stepOneDescription: "Fill out the form with your hostel or campus issue and share the important details.",
                    stepTwoTitle: "Review",
                    stepTwoDescription: "The support team checks the complaint and updates the progress when action starts.",
                    stepThreeTitle: "Resolve",
                    stepThreeDescription: "Once the issue is handled, the case is closed with a clear outcome.",
                    promiseBadge: "Our Promise",
                    promiseTitle: "Less friction. More action. Better campus support.",
                    promiseDescription: "We want this portal to feel calm, trustworthy, and practical for every student who needs help."
                },
                contact: {
                    title: "Contact Us",
                    description: "Have questions about how to use the portal? Reach out to our support team.",
                    infoTitle: "Get in Touch",
                    infoDescription: "If you prefer not to use the form, you can reach us directly via email or phone.",
                    name: "Your Name",
                    email: "Your Email",
                    message: "Message",
                    namePlaceholder: "Your name",
                    emailPlaceholder: "Your email",
                    messagePlaceholder: "How can we help you?",
                    submit: "Send Message",
                    emailLabel: "Email:",
                    phoneLabel: "Phone:",
                    hoursLabel: "Hours:",
                    hoursValue: "Mon - Sat, 9:00 AM - 8:00 PM"
                },
                feedback: {
                    title: "Feedback Form",
                    description: "Write your feedback here",
                    name: "Name",
                    email: "Email",
                    titleLabel: "Title",
                    descriptionLabel: "Description",
                    namePlaceholder: "Enter your name",
                    emailPlaceholder: "Enter your email",
                    titlePlaceholder: "Enter feedback title",
                    descriptionPlaceholder: "Write your feedback here...",
                    counterSuffix: "Characters",
                    info: "Maximum 2000 characters allowed",
                    submit: "Send Feedback",
                    success: "Feedback Submitted Successfully!"
                },
                auth: {
                    loginTitle: "Login",
                    signupTitle: "Sign Up",
                    forgotTitle: "Forgot Password",
                    username: "Username:",
                    email: "Email:",
                    password: "Password:",
                    confirmPassword: "Confirm Password:",
                    newPassword: "New Password:",
                    forgotLink: "Forgot your password?",
                    noAccount: "Don't have an account?",
                    alreadyAccount: "Already have an account?",
                    rememberPassword: "Remembered password?",
                    loginButton: "Login",
                    signupButton: "Sign Up",
                    recoverButton: "Recover Password",
                    usernamePlaceholder: "username",
                    emailPlaceholder: "email",
                    passwordPlaceholder: "password",
                    confirmPasswordPlaceholder: "confirm password",
                    newPasswordPlaceholder: "new password"
                },
                complain: {
                    eyebrow: "Complaint Desk",
                    title: "Campus Problems",
                    openForm: "Write Complaint",
                    allFilter: "All",
                    campusFilter: "Campus",
                    boysFilter: "Boys Hostel",
                    girlsFilter: "Girls Hostel",
                    emptyTitle: "No complaints yet",
                    emptyDescription: "Once a complaint is submitted, it will appear here with title, description, photo, and status.",
                    formEyebrow: "New Complaint",
                    formTitle: "Submit Problem",
                    closeLabel: "Close form",
                    name: "Name",
                    email: "Email",
                    place: "Place",
                    placePlaceholder: "Select place",
                    campusHouse: "Campus House",
                    campusHousePlaceholder: "Select house",
                    hostelArea: "Hostel Area",
                    hostelAreaPlaceholder: "Select area",
                    roomNumber: "Room Number",
                    roomNumberPlaceholder: "Room number",
                    problemType: "Problem Type",
                    problemTypePlaceholder: "Select problem",
                    titleLabel: "Title",
                    titlePlaceholder: "Short complaint title",
                    descriptionLabel: "Description",
                    descriptionPlaceholder: "Problem detail likho...",
                    photoLabel: "Upload Photo",
                    submit: "Submit Complaint",
                    success: "Complaint submitted successfully."
                },
                explore: {
                    eyebrow: "Campus Gallery",
                    title: "Explore NavGurukul Photos",
                    description: "Campus, hostel, activity, and student life photos will appear here. Add more photos inside the gallery whenever you send them.",
                    campus: "Campus",
                    building: "Building",
                    hostel: "Hostel",
                    activity: "Activity",
                    students: "Students",
                    life: "Life",
                    mainCampus: "Main Campus View",
                    learningSpace: "Learning Space",
                    boysHostel: "Boys Hostel",
                    campusActivity: "Campus Activity",
                    studentLife: "Student Life",
                    campusMoments: "Campus Moments"
                }
            }
        },
        hi: {
            nav: {
                home: "होम",
                about: "हमारे बारे में",
                explore: "गैलरी",
                complain: "शिकायत",
                feedback: "प्रतिक्रिया",
                contact: "संपर्क"
            },
            ui: {
                signIn: "साइन इन",
                signUp: "साइन अप",
                dark: "डार्क",
                light: "लाइट",
                languageToggle: "English",
                back: "वापस",
                goBack: "पीछे जाएँ",
                switchToDark: "डार्क मोड में बदलें",
                switchToLight: "लाइट मोड में बदलें",
                switchToHindi: "हिंदी में बदलें",
                switchToEnglish: "अंग्रेज़ी में बदलें"
            },
            messages: {
                contactInvalid: "कृपया फ़ॉर्म सही से भरें।",
                contactSent: "संदेश भेज दिया गया है। हम 24 घंटे के भीतर जवाब देंगे।",
                feedbackSuccess: "प्रतिक्रिया सफलतापूर्वक भेज दी गई है!",
                loginFillAll: "कृपया सभी फ़ील्ड भरें",
                loginInvalid: "गलत लॉगिन जानकारी",
                loginDone: "लॉगिन सफल",
                signupFillAll: "कृपया सभी फ़ील्ड भरें",
                signupMismatch: "पासवर्ड मेल नहीं खाते",
                signupDone: "साइनअप सफल",
                recoverNoAccount: "इस ईमेल के साथ कोई खाता नहीं मिला",
                recoverUpdated: "पासवर्ड अपडेट हो गया",
                complaintSuccess: "शिकायत सफलतापूर्वक दर्ज हो गई है।",
                sending: "भेजा जा रहा है...",
                showDetails: "विवरण दिखाएँ",
                hideDetails: "विवरण छिपाएँ",
                hideInfo: "विवरण छिपाएँ",
                showInfo: "विवरण दिखाएँ"
            },
            pages: {
                index: {
                    title: "कैम्पस शिकायत और रखरखाव पोर्टल",
                    subtitle: "लड़कों के हॉस्टल, लड़कियों के हॉस्टल<br>और कैम्पस की समस्याएँ।",
                    description: "NavGurukul में हॉस्टल और कैम्पस से जुड़ी समस्याएँ एक ही जगह देखें और शिकायत दर्ज करें।",
                    primaryAction: "समस्या दर्ज करें",
                    secondaryAction: "विकल्प देखें",
                    supportBadge: "NavGurukul सहायता",
                    supportTitle: "अपनी समस्या चुनें",
                    supportDescription: "समस्या श्रेणी चुनें ताकि हॉस्टल या कैम्पस सपोर्ट टीम तक अपडेट आसानी से पहुँच सके।",
                    problemCards: [
                        { title: "लड़कों का हॉस्टल", description: "कमरा, बाथरूम और कॉमन एरिया की समस्याएँ।" },
                        { title: "लड़कियों का हॉस्टल", description: "सुरक्षा, कमरा और रोज़मर्रा की सुविधाओं की समस्याएँ।" },
                        { title: "कैम्पस", description: "कक्षा, मैदान और कैम्पस सुविधाओं की समस्याएँ।" }
                    ],
                    problemMessage: "लड़कों के हॉस्टल का स्टेटस देखने के लिए किसी भी समस्या पर जाएँ।",
                    sidePanelTitle: "लड़कों के हॉस्टल की समस्याएँ",
                    sidePanelLabel: "यूज़र समस्या पैनल",
                    searchLabel: "समस्या खोजें या लिखें",
                    searchPlaceholder: "समस्या खोजें या अपनी शिकायत लिखें",
                    galleryBadge: "कैम्पस गैलरी",
                    galleryTitle: "NavGurukul की तस्वीरें",
                    galleryDescription: "यहाँ कैम्पस और हॉस्टल की तस्वीरें देखें। जब भी नई तस्वीरें भेजें, गैलरी में जोड़ दी जाएँगी।"
                },
                about: {
                    heroBadge: "पोर्टल के बारे में",
                    heroTitle: "कैम्पस सहायता को तेज़ और आसान बनाना।",
                    heroDescription: "हॉस्टल या कैम्पस की समस्या दर्ज करें, प्रगति देखें और बिना उलझन के साफ़ अपडेट पाएँ।",
                    primaryAction: "समस्या दर्ज करें",
                    secondaryAction: "कैसे काम करता है देखें",
                    statOneValue: "3",
                    statOneLabel: "समस्या से समाधान तक 3 आसान चरण",
                    statTwoValue: "24/7",
                    statTwoLabel: "ज़रूरत पड़ने पर हमेशा उपलब्ध",
                    statThreeValue: "100%",
                    statThreeLabel: "पारदर्शिता और फॉलो-अप पर ध्यान",
                    whyBadge: "क्यों बनाया गया",
                    whyTitle: "कैम्पस समस्याएँ दर्ज करने की सरल जगह",
                    whyDescription: "छात्रों को यह अनुमान नहीं लगाना चाहिए कि किससे संपर्क करें या शिकायत कहाँ अटकी है। यह पोर्टल प्रक्रिया को साफ़ और सीधा रखता है।",
                    featureOneTitle: "निजी",
                    featureOneDescription: "आपकी जानकारी सुरक्षित रहती है, ताकि आप भरोसे के साथ समस्या दर्ज कर सकें।",
                    featureTwoTitle: "तेज़ कार्रवाई",
                    featureTwoDescription: "शिकायतें जल्दी सही टीम तक पहुँचती हैं ताकि समीक्षा और समाधान हो सके।",
                    featureThreeTitle: "पारदर्शी",
                    featureThreeDescription: "अपनी शिकायत की स्थिति साफ़ तौर पर देखें और जानें कि हर चरण में क्या हो रहा है।",
                    processBadge: "यह कैसे काम करता है",
                    processTitle: "शिकायत से समाधान तक तीन चरण",
                    processDescription: "यह प्रक्रिया जानबूझकर सरल रखी गई है ताकि छात्र बिना उलझन के समस्या दर्ज कर सकें।",
                    stepOneTitle: "जमा करें",
                    stepOneDescription: "फ़ॉर्म भरें, अपनी हॉस्टल या कैम्पस समस्या और ज़रूरी जानकारी साझा करें।",
                    stepTwoTitle: "समीक्षा",
                    stepTwoDescription: "सपोर्ट टीम शिकायत जाँचती है और कार्रवाई शुरू होते ही प्रगति अपडेट करती है।",
                    stepThreeTitle: "समाधान",
                    stepThreeDescription: "समस्या हल होने पर मामला स्पष्ट परिणाम के साथ बंद किया जाता है।",
                    promiseBadge: "हमारा वादा",
                    promiseTitle: "कम झंझट। ज़्यादा कार्रवाई। बेहतर कैम्पस सहायता।",
                    promiseDescription: "हम चाहते हैं कि यह पोर्टल हर उस छात्र के लिए शांत, भरोसेमंद और उपयोगी महसूस हो जिसे मदद चाहिए।"
                },
                contact: {
                    title: "हमसे संपर्क करें",
                    description: "क्या पोर्टल इस्तेमाल करने में कोई सवाल है? हमारी सपोर्ट टीम से संपर्क करें।",
                    infoTitle: "संपर्क में रहें",
                    infoDescription: "अगर आप फ़ॉर्म इस्तेमाल नहीं करना चाहते, तो ईमेल या फोन के जरिए सीधे संपर्क कर सकते हैं।",
                    name: "आपका नाम",
                    email: "आपका ईमेल",
                    message: "संदेश",
                    namePlaceholder: "आपका नाम",
                    emailPlaceholder: "आपका ईमेल",
                    messagePlaceholder: "हम आपकी कैसे मदद कर सकते हैं?",
                    submit: "संदेश भेजें",
                    emailLabel: "ईमेल:",
                    phoneLabel: "फोन:",
                    hoursLabel: "समय:",
                    hoursValue: "सोम - शनि, सुबह 9:00 से रात 8:00 तक"
                },
                feedback: {
                    title: "प्रतिक्रिया फ़ॉर्म",
                    description: "अपनी प्रतिक्रिया यहाँ लिखें",
                    name: "नाम",
                    email: "ईमेल",
                    titleLabel: "शीर्षक",
                    descriptionLabel: "विवरण",
                    namePlaceholder: "अपना नाम लिखें",
                    emailPlaceholder: "अपना ईमेल लिखें",
                    titlePlaceholder: "प्रतिक्रिया का शीर्षक लिखें",
                    descriptionPlaceholder: "अपनी प्रतिक्रिया यहाँ लिखें...",
                    counterSuffix: "अक्षर",
                    info: "अधिकतम 2000 अक्षर अनुमति है",
                    submit: "प्रतिक्रिया भेजें",
                    success: "प्रतिक्रिया सफलतापूर्वक भेज दी गई है!"
                },
                auth: {
                    loginTitle: "लॉगिन",
                    signupTitle: "साइन अप",
                    forgotTitle: "पासवर्ड भूल गए",
                    username: "यूज़रनेम:",
                    email: "ईमेल:",
                    password: "पासवर्ड:",
                    confirmPassword: "पासवर्ड पुष्टि करें:",
                    newPassword: "नया पासवर्ड:",
                    forgotLink: "पासवर्ड भूल गए?",
                    noAccount: "खाता नहीं है?",
                    alreadyAccount: "पहले से खाता है?",
                    rememberPassword: "पासवर्ड याद आ गया?",
                    loginButton: "लॉगिन",
                    signupButton: "साइन अप",
                    recoverButton: "पासवर्ड पुनर्प्राप्त करें",
                    usernamePlaceholder: "यूज़रनेम",
                    emailPlaceholder: "ईमेल",
                    passwordPlaceholder: "पासवर्ड",
                    confirmPasswordPlaceholder: "पासवर्ड पुष्टि करें",
                    newPasswordPlaceholder: "नया पासवर्ड"
                },
                complain: {
                    eyebrow: "शिकायत डेस्क",
                    title: "कैम्पस समस्याएँ",
                    openForm: "शिकायत लिखें",
                    allFilter: "सभी",
                    campusFilter: "कैम्पस",
                    boysFilter: "लड़कों का हॉस्टल",
                    girlsFilter: "लड़कियों का हॉस्टल",
                    emptyTitle: "अभी कोई शिकायत नहीं है",
                    emptyDescription: "जैसे ही शिकायत दर्ज होगी, वह शीर्षक, विवरण, फोटो और स्थिति के साथ यहाँ दिखेगी।",
                    formEyebrow: "नई शिकायत",
                    formTitle: "समस्या जमा करें",
                    closeLabel: "फ़ॉर्म बंद करें",
                    name: "नाम",
                    email: "ईमेल",
                    place: "स्थान",
                    placePlaceholder: "स्थान चुनें",
                    campusHouse: "कैम्पस हाउस",
                    campusHousePlaceholder: "हाउस चुनें",
                    hostelArea: "हॉस्टल एरिया",
                    hostelAreaPlaceholder: "एरिया चुनें",
                    roomNumber: "रूम नंबर",
                    roomNumberPlaceholder: "रूम नंबर",
                    problemType: "समस्या का प्रकार",
                    problemTypePlaceholder: "समस्या चुनें",
                    titleLabel: "शीर्षक",
                    titlePlaceholder: "संक्षिप्त शिकायत शीर्षक",
                    descriptionLabel: "विवरण",
                    descriptionPlaceholder: "Problem detail likho...",
                    photoLabel: "फ़ोटो अपलोड करें",
                    submit: "शिकायत जमा करें",
                    success: "शिकायत सफलतापूर्वक दर्ज हो गई है।"
                },
                explore: {
                    eyebrow: "कैम्पस गैलरी",
                    title: "NavGurukul की तस्वीरें देखें",
                    description: "यहाँ कैम्पस, हॉस्टल, गतिविधि और छात्र जीवन की तस्वीरें दिखाई जाएँगी। नई तस्वीरें भेजते रहें, हम गैलरी में जोड़ते रहेंगे।",
                    campus: "कैम्पस",
                    building: "इमारत",
                    hostel: "हॉस्टल",
                    activity: "गतिविधि",
                    students: "छात्र",
                    life: "जीवन",
                    mainCampus: "मुख्य कैम्पस दृश्य",
                    learningSpace: "लर्निंग स्पेस",
                    boysHostel: "लड़कों का हॉस्टल",
                    campusActivity: "कैम्पस गतिविधि",
                    studentLife: "छात्र जीवन",
                    campusMoments: "कैम्पस के पल"
                }
            }
        }
    };

    const MOTION_SELECTORS = [
        "main > section",
        "main > article",
        "main > div",
        ".about-hero",
        ".about-hero__content",
        ".about-hero__visual",
        ".story-section",
        ".process-section",
        ".promise-section",
        ".section-heading",
        ".stats-grid > *",
        ".feature-grid > *",
        ".timeline > *",
        ".contact-header",
        ".contact-grid",
        ".contact-info",
        ".contact-form-box",
        ".explore-hero",
        ".gallery-board > *",
        ".complaints-panel",
        ".panel-header",
        ".filters",
        ".complaint-list > *",
        ".form-panel",
        ".feedback-card",
        ".container",
        ".signup",
        ".forgot",
        ".problem-grid > *",
        ".side-problem-panel",
        ".hero-content",
        ".hero-text-box"
    ].join(", ");

    const state = {
        language: getSavedLanguage(),
    };

    function getCurrentPage() {
        return window.location.pathname.split("/").pop() || "index.html";
    }

    function getSavedTheme() {
        return localStorage.getItem(THEME_STORAGE_KEY) || "light";
    }

    function getSavedLanguage() {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return saved === "hi" ? "hi" : "en";
    }

    function lookup(path, language = state.language) {
        const keys = path.split(".");
        let current = COPY[language];

        for (const key of keys) {
            current = current && current[key];
        }

        if (current === undefined) {
            current = COPY.en;
            for (const key of keys) {
                current = current && current[key];
            }
        }

        return current ?? "";
    }

    function setText(selector, text, root = document) {
        const element = root.querySelector(selector);

        if (element) {
            element.innerHTML = text;
        }
    }

    function setPlainText(selector, text, root = document) {
        const element = root.querySelector(selector);

        if (element) {
            element.textContent = text;
        }
    }

    function setPlaceholder(selector, text, root = document) {
        const element = root.querySelector(selector);

        if (element) {
            element.placeholder = text;
        }
    }

    function setAriaLabel(selector, text, root = document) {
        const element = root.querySelector(selector);

        if (element) {
            element.setAttribute("aria-label", text);
        }
    }

    function setSelectOptions(selector, values, root = document) {
        const element = root.querySelector(selector);

        if (!element) {
            return;
        }

        Array.from(element.options).forEach((option, index) => {
            if (values[index] !== undefined) {
                option.textContent = values[index];
            }
        });
    }

    function setButtonLabel(selector, text, root = document) {
        const element = root.querySelector(selector);

        if (element) {
            element.textContent = text;
        }
    }

    function buildNavLink(item, currentPage) {
        const label = lookup(`nav.${item.key}`);
        const activeClass = item.href === currentPage ? " active" : "";

        return `
            <a href="${item.href}" class="${activeClass.trim()}">
                ${label}
            </a>
        `;
    }

    function buildAuthMarkup() {
        return `
            <div class="hp-auth auth-actions">
                <button class="theme-toggle" type="button" aria-label="${lookup("ui.switchToDark") || "Switch to dark mode"}" aria-pressed="false">
                    <span class="theme-icon" aria-hidden="true">☾</span>
                    <span class="theme-text">${lookup("ui.dark")}</span>
                </button>
                <button class="language-link language-toggle" type="button" aria-label="${state.language === "en" ? lookup("ui.switchToHindi") : lookup("ui.switchToEnglish")}">
                    ${lookup("ui.languageToggle")}
                </button>
                <a class="auth-link signin-link" href="login.html">${lookup("ui.signIn")}</a>
                <a class="auth-link hp-signup" href="signup.html">${lookup("ui.signUp")}</a>
            </div>
        `;
    }

    function buildNavbarMarkup(currentPage) {
        const navLinks = NAV_ITEMS.map((item) => buildNavLink(item, currentPage)).join("");

        return `
            <header class="site-header">
                <div class="container">
                    <a class="brand" href="index.html" aria-label="NavGurukul home">
                        <img src="images/Navgurukul_img-removebg-preview.png" alt="NavGurukul">
                    </a>

                    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
                    <nav id="navigation">
                        <div class="nav-panel-top">
                            <img src="images/Navgurukul_img-removebg-preview.png" alt="NavGurukul">
                            <button class="menu-close" type="button" aria-label="Close navigation">×</button>
                        </div>

                        <ul class="nav-list hp-nav-list">
                            ${navLinks}
                        </ul>
                    </nav>
                    ${buildAuthMarkup()}
                </div>
            </header>
        `;
    }

    function injectNavbar() {
        const currentPage = getCurrentPage();
        const existingHeader = document.querySelector(".site-header");

        if (existingHeader) {
            return existingHeader;
        }

        if (currentPage === "index.html") {
            return null;
        }

        document.body.insertAdjacentHTML("afterbegin", buildNavbarMarkup(currentPage));
        document.body.classList.add("has-global-navbar");
        return document.querySelector(".site-header");
    }

    function wireNavbarInteractions(header) {
        if (!header) {
            return;
        }

        const currentPage = getCurrentPage();
        const menuToggle = header.querySelector(".menu-toggle");
        const menuClose = header.querySelector(".menu-close");
        const navLinks = header.querySelectorAll(".nav-list a");
        const languageToggle = header.querySelector(".language-toggle");

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === currentPage);
        });

        if (currentPage !== "index.html") {
            if (menuToggle) {
                menuToggle.addEventListener("click", openNavigation);
            }

            if (menuClose) {
                menuClose.addEventListener("click", closeNavigation);
            }

            navLinks.forEach((link) => {
                link.addEventListener("click", closeNavigation);
            });

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    closeNavigation();
                }
            });
        }

        if (languageToggle) {
            languageToggle.addEventListener("click", () => {
                setLanguage(state.language === "en" ? "hi" : "en");
            });
        }
    }

    function updateNavbarText() {
        const header = document.querySelector(".site-header");

        if (!header) {
            return;
        }

        header.querySelectorAll(".nav-list a").forEach((link) => {
            const href = link.getAttribute("href");
            const matched = NAV_ITEMS.find((item) => item.href === href);

            if (matched) {
                link.textContent = lookup(`nav.${matched.key}`);
            }
            link.classList.toggle("active", href === getCurrentPage());
        });

        const themeToggle = header.querySelector(".theme-toggle");
        const themeText = header.querySelector(".theme-text");
        const themeIcon = header.querySelector(".theme-icon");
        const languageToggle = header.querySelector(".language-toggle");

        if (themeToggle) {
            const isDark = document.body.classList.contains("dark-mode");
            themeToggle.setAttribute("aria-label", isDark ? lookup("ui.switchToLight") : lookup("ui.switchToDark"));

            if (themeText) {
                themeText.textContent = isDark ? lookup("ui.light") : lookup("ui.dark");
            }

            if (themeIcon) {
                themeIcon.textContent = isDark ? "☀" : "☾";
            }
        }

        if (languageToggle) {
            languageToggle.textContent = lookup("ui.languageToggle");
            languageToggle.setAttribute(
                "aria-label",
                state.language === "en" ? lookup("ui.switchToHindi") : lookup("ui.switchToEnglish")
            );
        }
    }

    function translateIndex() {
        const copy = lookup("pages.index");

        setPlainText(".hero-text-box h1", copy.title);
        setText(".hero-text-box h2", copy.subtitle);
        setPlainText(".hero-text-box p", copy.description);
        setButtonLabel(".btn-orange", copy.primaryAction);
        setButtonLabel(".btn-white", copy.secondaryAction);

        const sectionHeading = document.querySelector(".problem-section .section-heading");

        if (sectionHeading) {
            setPlainText(".section-heading span", copy.supportBadge, document.querySelector(".problem-section"));
            setPlainText(".section-heading h2", copy.supportTitle, document.querySelector(".problem-section"));
            setPlainText(".section-heading p", copy.supportDescription, document.querySelector(".problem-section"));
        }

        const problemCards = document.querySelectorAll(".problem-card");
        problemCards.forEach((card, index) => {
            const item = copy.problemCards[index];

            if (!item) {
                return;
            }

            const title = card.querySelector("h3");
            const description = card.querySelector("p");

            if (title) {
                title.textContent = item.title;
            }

            if (description) {
                description.textContent = item.description;
            }
        });

        setPlainText("#problemMessage", copy.problemMessage);
        setPlainText("#sidePanelTitle", copy.sidePanelTitle);
        setPlainText(".side-panel-heading span", copy.sidePanelLabel);
        setPlainText(".side-problem-panel label span", copy.searchLabel);
        setPlaceholder("#problemType", copy.searchPlaceholder);

        const galleryHeading = document.querySelector(".gallery-section .section-heading");
        if (galleryHeading) {
            setPlainText(".section-heading span", copy.galleryBadge, document.querySelector(".gallery-section"));
            setPlainText(".section-heading h2", copy.galleryTitle, document.querySelector(".gallery-section"));
            setPlainText(".section-heading p", copy.galleryDescription, document.querySelector(".gallery-section"));
        }

        const galleryLabels = [
            copy.galleryBadge,
            copy.galleryTitle,
            copy.galleryDescription
        ];
        void galleryLabels;
    }

    function translateAbout() {
        const copy = lookup("pages.about");

        setPlainText(".about-hero .eyebrow", copy.heroBadge);
        setPlainText(".about-hero h1", copy.heroTitle);
        setPlainText(".about-hero .lead", copy.heroDescription);
        setButtonLabel(".about-hero .primary-action", copy.primaryAction);
        setButtonLabel(".about-hero .secondary-action", copy.secondaryAction);

        const statCards = document.querySelectorAll(".stats-grid .stat-card");
        if (statCards[0]) {
            statCards[0].querySelector("strong").textContent = copy.statOneValue;
            statCards[0].querySelector("span").textContent = copy.statOneLabel;
        }
        if (statCards[1]) {
            statCards[1].querySelector("strong").textContent = copy.statTwoValue;
            statCards[1].querySelector("span").textContent = copy.statTwoLabel;
        }
        if (statCards[2]) {
            statCards[2].querySelector("strong").textContent = copy.statThreeValue;
            statCards[2].querySelector("span").textContent = copy.statThreeLabel;
        }

        const whySection = document.querySelector(".story-section .section-heading");
        if (whySection) {
            setPlainText(".section-heading span", copy.whyBadge, document.querySelector(".story-section"));
            setPlainText(".section-heading h2", copy.whyTitle, document.querySelector(".story-section"));
            setPlainText(".section-heading p", copy.whyDescription, document.querySelector(".story-section"));
        }

        const featureCards = document.querySelectorAll(".feature-grid .feature-card");
        if (featureCards[0]) {
            featureCards[0].querySelector("h3").textContent = copy.featureOneTitle;
            featureCards[0].querySelector("p").textContent = copy.featureOneDescription;
        }
        if (featureCards[1]) {
            featureCards[1].querySelector("h3").textContent = copy.featureTwoTitle;
            featureCards[1].querySelector("p").textContent = copy.featureTwoDescription;
        }
        if (featureCards[2]) {
            featureCards[2].querySelector("h3").textContent = copy.featureThreeTitle;
            featureCards[2].querySelector("p").textContent = copy.featureThreeDescription;
        }

        const processSection = document.querySelector(".process-section .section-heading");
        if (processSection) {
            setPlainText(".section-heading span", copy.processBadge, document.querySelector(".process-section"));
            setPlainText(".section-heading h2", copy.processTitle, document.querySelector(".process-section"));
            setPlainText(".section-heading p", copy.processDescription, document.querySelector(".process-section"));
        }

        const timelineItems = document.querySelectorAll(".timeline .timeline-item");
        if (timelineItems[0]) {
            timelineItems[0].querySelector("h3").textContent = copy.stepOneTitle;
            timelineItems[0].querySelector("p").textContent = copy.stepOneDescription;
        }
        if (timelineItems[1]) {
            timelineItems[1].querySelector("h3").textContent = copy.stepTwoTitle;
            timelineItems[1].querySelector("p").textContent = copy.stepTwoDescription;
        }
        if (timelineItems[2]) {
            timelineItems[2].querySelector("h3").textContent = copy.stepThreeTitle;
            timelineItems[2].querySelector("p").textContent = copy.stepThreeDescription;
        }

        const promiseSection = document.querySelector(".promise-section .promise-card");
        if (promiseSection) {
            const eyebrow = promiseSection.querySelector(".eyebrow");
            const title = promiseSection.querySelector("h2");
            const description = promiseSection.querySelector("p");

            if (eyebrow) {
                eyebrow.textContent = copy.promiseBadge;
            }
            if (title) {
                title.textContent = copy.promiseTitle;
            }
            if (description) {
                description.textContent = copy.promiseDescription;
            }
        }
    }

    function translateContact() {
        const copy = lookup("pages.contact");

        setPlainText(".contact-header h2", copy.title);
        setPlainText(".contact-header p", copy.description);
        setPlainText(".contact-info h3", copy.infoTitle);
        setPlainText(".contact-info p", copy.infoDescription);
        setPlainText(".contact-info .info-item:nth-of-type(1)", `${copy.emailLabel} Navgurukul@25.org`);
        setPlainText(".contact-info .info-item:nth-of-type(2)", `${copy.phoneLabel} +91 9192939495`);
        setPlainText(".contact-info .info-item:nth-of-type(3)", `${copy.hoursLabel} ${copy.hoursValue}`);
        setPlainText(".form-group label[for='name']", copy.name);
        setPlainText(".form-group label[for='email']", copy.email);
        setPlainText(".form-group label[for='message']", copy.message);
        setPlaceholder("#name", copy.namePlaceholder);
        setPlaceholder("#email", copy.emailPlaceholder);
        setPlaceholder("#message", copy.messagePlaceholder);
        setButtonLabel(".submit-btn", copy.submit);
    }

    function translateFeedback() {
        const copy = lookup("pages.feedback");

        setPlainText(".container h1", copy.title);
        setPlainText(".container > p", copy.description);
        const labels = document.querySelectorAll("#Feedbackform label");
        if (labels[0]) labels[0].textContent = copy.name;
        if (labels[1]) labels[1].textContent = copy.email;
        if (labels[2]) labels[2].textContent = copy.titleLabel;
        if (labels[3]) labels[3].textContent = copy.descriptionLabel;
        setPlaceholder("#name", copy.namePlaceholder);
        setPlaceholder("#email", copy.emailPlaceholder);
        setPlaceholder("#title", copy.titlePlaceholder);
        setPlaceholder("#description", copy.descriptionPlaceholder);
        setButtonLabel("button[type='submit']", copy.submit);
        setPlainText("#successMessage", `🎉 ${copy.success}`);
        setPlainText(".counter-label", `/2000 ${copy.counterSuffix}`);
        setPlainText(".info", copy.info);
    }

    function translateAuth() {
        const copy = lookup("pages.auth");
        const page = getCurrentPage();

        if (page === "login.html") {
            setPlainText(".container h1", copy.loginTitle);
            setPlainText("label[for='name']", copy.username);
            setPlainText("label[for='email']", copy.email);
            setPlainText("label[for='password']", copy.password);
            setPlaceholder("#name", copy.usernamePlaceholder);
            setPlaceholder("#email", copy.emailPlaceholder);
            setPlaceholder("#password", copy.passwordPlaceholder);
            setButtonLabel("#btn", copy.loginButton);
            setPlainText(".forgot-link", copy.forgotLink);
            const note = document.querySelector(".account-note__text");
            if (note) {
                note.textContent = copy.noAccount;
            }
            const signupLink = document.querySelector(".container .btn");
            if (signupLink) {
                signupLink.textContent = copy.signupButton;
            }
        }

        if (page === "signup.html") {
            setPlainText(".signup h2", copy.signupTitle);
            setPlainText("label[for='name']", copy.username);
            setPlainText("label[for='email']", copy.email);
            setPlainText("label[for='password']", copy.password);
            setPlainText("label[for='passw']", copy.confirmPassword);
            setPlaceholder("#name", copy.usernamePlaceholder);
            setPlaceholder("#email", copy.emailPlaceholder);
            setPlaceholder("#password", copy.passwordPlaceholder);
            setPlaceholder("#passw", copy.confirmPasswordPlaceholder);
            setButtonLabel("#sign", copy.signupButton);
            const note = document.querySelector(".signup .account-note__text");
            if (note) {
                note.textContent = copy.alreadyAccount;
            }
            const loginLink = document.querySelector(".signup .btn");
            if (loginLink) {
                loginLink.textContent = copy.loginButton;
            }
        }

        if (page === "forgot.html") {
            setPlainText(".forgot h2", copy.forgotTitle);
            setPlainText("label[for='email']", copy.email);
            setPlainText("label[for='new-password']", copy.newPassword);
            setPlainText("label[for='confirm-password']", copy.confirmPassword);
            setPlaceholder("#email", copy.emailPlaceholder);
            setPlaceholder("#new-password", copy.newPasswordPlaceholder);
            setPlaceholder("#confirm-password", copy.confirmPasswordPlaceholder);
            setButtonLabel("#recover", copy.recoverButton);
            const note = document.querySelector(".forgot .account-note__text");
            if (note) {
                note.textContent = copy.rememberPassword;
            }
            const loginLink = document.querySelector(".forgot .btn");
            if (loginLink) {
                loginLink.textContent = copy.loginButton;
            }
        }
    }

    function translateComplain() {
        const copy = lookup("pages.complain");

        setPlainText(".panel-header .eyebrow", copy.eyebrow);
        setPlainText(".panel-header h1", copy.title);
        setButtonLabel("#openFormBtn", copy.openForm);
        setButtonLabel(".filter-btn[data-filter='All']", copy.allFilter);
        setButtonLabel(".filter-btn[data-filter='Campus']", copy.campusFilter);
        setButtonLabel(".filter-btn[data-filter='Boys hostel']", copy.boysFilter);
        setButtonLabel(".filter-btn[data-filter='Girls hostel']", copy.girlsFilter);
        setPlainText("#emptyState h2", copy.emptyTitle);
        setPlainText("#emptyState p", copy.emptyDescription);
        setPlainText(".form-header .eyebrow", copy.formEyebrow);
        setPlainText(".form-header h2", copy.formTitle);
        setAriaLabel("#closeFormBtn", copy.closeLabel);
        const fieldLabels = document.querySelectorAll(".form .field-label");
        if (fieldLabels[0]) fieldLabels[0].textContent = copy.name;
        if (fieldLabels[1]) fieldLabels[1].textContent = copy.email;
        if (fieldLabels[2]) fieldLabels[2].textContent = copy.place;
        if (fieldLabels[3]) fieldLabels[3].textContent = copy.campusHouse;
        if (fieldLabels[4]) fieldLabels[4].textContent = copy.hostelArea;
        if (fieldLabels[5]) fieldLabels[5].textContent = copy.roomNumber;
        if (fieldLabels[6]) fieldLabels[6].textContent = copy.problemType;
        if (fieldLabels[7]) fieldLabels[7].textContent = copy.titleLabel;
        if (fieldLabels[8]) fieldLabels[8].textContent = copy.descriptionLabel;
        if (fieldLabels[9]) fieldLabels[9].textContent = copy.photoLabel;
        setPlaceholder("#name", copy.name);
        setPlaceholder("#email", copy.email);
        setPlaceholder("#roomNumber", copy.roomNumberPlaceholder);
        setPlaceholder("#description", copy.descriptionPlaceholder);
        setButtonLabel(".submit-btn", copy.submit);

        setSelectOptions("#place", [copy.placePlaceholder, copy.campusFilter, copy.boysFilter, copy.girlsFilter]);
        setSelectOptions("#house", [copy.campusHousePlaceholder, "Malhar House", "Bhairav House", "Bageshree House"]);
        setSelectOptions("#hostelArea", [copy.hostelAreaPlaceholder, "Dining Hall", "Room"]);
        setSelectOptions("#problemType", [copy.problemTypePlaceholder, "Water leakage", "Fan not working", "Electricity issues", "WiFi issues", "Cleanliness concerns", "Furniture damage", "Other"]);
        setPlainText("#message", "");
    }

    function translateExplore() {
        const copy = lookup("pages.explore");

        setPlainText(".explore-hero .eyebrow", copy.eyebrow);
        setPlainText(".explore-hero h1", copy.title);
        setPlainText(".explore-hero p", copy.description);

        const cards = document.querySelectorAll(".gallery-board .photo-card");
        const cardCopy = [
            [copy.campus, copy.mainCampus],
            [copy.building, copy.learningSpace],
            [copy.hostel, copy.boysHostel],
            [copy.activity, copy.campusActivity],
            [copy.students, copy.studentLife],
            [copy.life, copy.campusMoments]
        ];

        cards.forEach((card, index) => {
            const pair = cardCopy[index];
            if (!pair) {
                return;
            }
            const small = card.querySelector("span");
            const title = card.querySelector("h2");
            if (small) {
                small.textContent = pair[0];
            }
            if (title) {
                title.textContent = pair[1];
            }
        });
    }

    function applyPageTranslations() {
        const page = getCurrentPage();
        document.documentElement.lang = state.language;

        const titleMap = {
            "index.html": state.language === "hi" ? "कैम्पस शिकायत और रखरखाव पोर्टल" : "Campus Complaint & Maintenance Portal",
            "about.html": state.language === "hi" ? "हमारे बारे में" : "About Us",
            "contact.html": state.language === "hi" ? "हमसे संपर्क करें" : "Contact Us",
            "feedback.html": state.language === "hi" ? "प्रतिक्रिया फ़ॉर्म" : "Feedback Form",
            "complain.html": state.language === "hi" ? "कैम्पस शिकायतें" : "Campus Complaints",
            "login.html": state.language === "hi" ? "लॉगिन" : "Login",
            "signup.html": state.language === "hi" ? "साइन अप" : "Sign Up",
            "forgot.html": state.language === "hi" ? "पासवर्ड भूल गए" : "Forgot Password",
            "explore.html": state.language === "hi" ? "कैम्पस गैलरी" : "Explore Campus"
        };

        if (titleMap[page]) {
            document.title = titleMap[page];
        }

        updateNavbarText();

        if (page === "index.html") {
            translateIndex();
        } else if (page === "about.html") {
            translateAbout();
        } else if (page === "contact.html") {
            translateContact();
        } else if (page === "feedback.html") {
            translateFeedback();
        } else if (page === "login.html" || page === "signup.html" || page === "forgot.html") {
            translateAuth();
        } else if (page === "complain.html") {
            translateComplain();
        } else if (page === "explore.html") {
            translateExplore();
        }
    }

    function setLanguage(language) {
        state.language = language === "hi" ? "hi" : "en";
        localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
        applyPageTranslations();
        window.dispatchEvent(new CustomEvent("campus-language-change", { detail: { language: state.language } }));
    }

    function getToggle() {
        let toggle = document.querySelector(".theme-toggle");

        if (toggle) {
            return toggle;
        }

        toggle = document.createElement("button");
        toggle.className = "theme-floating-toggle theme-toggle";
        toggle.type = "button";
        toggle.innerHTML = '<span class="theme-icon" aria-hidden="true">☾</span><span class="theme-text">Dark</span>';
        document.body.appendChild(toggle);
        return toggle;
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        const toggle = getToggle();
        const icon = toggle.querySelector(".theme-icon");
        const text = toggle.querySelector(".theme-text");

        document.body.classList.toggle("dark-mode", isDark);
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute(
            "aria-label",
            isDark ? lookup("ui.switchToLight") : lookup("ui.switchToDark")
        );

        if (icon) {
            icon.textContent = isDark ? "☀" : "☾";
        }

        if (text) {
            text.textContent = isDark ? lookup("ui.light") : lookup("ui.dark");
        }

        localStorage.setItem(THEME_STORAGE_KEY, theme);
        updateNavbarText();
    }

    function openNavigation() {
        document.body.classList.add("nav-open");
        const toggle = document.querySelector(".menu-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
        }
    }

    function closeNavigation() {
        document.body.classList.remove("nav-open");
        const toggle = document.querySelector(".menu-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    }

    function addBackButton() {
        const currentPage = getCurrentPage();

        if (currentPage === "index.html" || document.querySelector(".page-back-button")) {
            return;
        }

        const backButton = document.createElement("button");
        backButton.className = "page-back-button";
        backButton.type = "button";
        backButton.textContent = "←";
        backButton.setAttribute("aria-label", lookup("ui.goBack"));

        backButton.addEventListener("click", function () {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            window.location.href = "index.html";
        });

        document.body.appendChild(backButton);
    }

    function addMotionClasses() {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const motionTargets = Array.from(new Set(Array.from(document.querySelectorAll(MOTION_SELECTORS))))
            .filter((element) => element && !element.closest("nav") && !element.closest("header") && element.getClientRects().length > 0);

        if (!motionTargets.length) {
            return;
        }

        document.body.classList.add("page-loaded");

        motionTargets.forEach((element, index) => {
            element.classList.add("motion-item");
            if (index % 2 === 0) {
                element.classList.add("motion-fade");
            }
            if (index % 3 === 0) {
                element.classList.add("motion-scale");
            }
            element.style.setProperty("--motion-delay", `${Math.min(index * 70, 420)}ms`);
        });

        if (reducedMotion || !("IntersectionObserver" in window)) {
            motionTargets.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, instance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    instance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -6% 0px",
            }
        );

        motionTargets.forEach((element) => observer.observe(element));

        requestAnimationFrame(() => {
            motionTargets.forEach((element) => {
                if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
                    element.classList.add("is-visible");
                }
            });
        });
    }

    function init() {
        const currentPage = getCurrentPage();
        const header = injectNavbar();

        wireNavbarInteractions(header || document.querySelector(".site-header"));
        addBackButton();
        applyPageTranslations();
        addMotionClasses();
        applyTheme(getSavedTheme());

        const toggle = getToggle();
        toggle.addEventListener("click", function () {
            applyTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
        });
    }

    window.campusI18n = {
        getLanguage: () => state.language,
        setLanguage,
        toggleLanguage: () => setLanguage(state.language === "en" ? "hi" : "en"),
        t: (key) => lookup(key),
        messages: {
            contactInvalid: () => lookup("messages.contactInvalid"),
            contactSent: () => lookup("messages.contactSent"),
            feedbackSuccess: () => lookup("messages.feedbackSuccess"),
            loginFillAll: () => lookup("messages.loginFillAll"),
            loginInvalid: () => lookup("messages.loginInvalid"),
            loginDone: () => lookup("messages.loginDone"),
            signupFillAll: () => lookup("messages.signupFillAll"),
            signupMismatch: () => lookup("messages.signupMismatch"),
            signupDone: () => lookup("messages.signupDone"),
            recoverNoAccount: () => lookup("messages.recoverNoAccount"),
            recoverUpdated: () => lookup("messages.recoverUpdated"),
            complaintSuccess: () => lookup("messages.complaintSuccess"),
            sending: () => lookup("messages.sending"),
            showDetails: () => lookup("messages.showDetails"),
            hideDetails: () => lookup("messages.hideDetails"),
            hideInfo: () => lookup("messages.hideInfo"),
            showInfo: () => lookup("messages.showInfo")
        }
    };

    document.addEventListener("DOMContentLoaded", init);
})();
