// ============================================
// COMPLETE HABIT TRACKER - ALL FEATURES WORKING
// ============================================

// ডিফল্ট হ্যাবিট ডেটা
const DEFAULT_HABITS = [
    { id: 1, name: "ফজর নামাজ", emoji: "☀️", startTime: "05:00", endTime: "06:00", category: "spiritual", description: "ফজরের নামাজ আদায় করা" },
    { id: 2, name: "ফজরের পর ২ ঘণ্টা পড়াশোনা", emoji: "📚", startTime: "06:30", endTime: "08:30", category: "study", description: "ফজরের পর পড়াশোনা" },
    { id: 3, name: "যোহর নামাজ", emoji: "🕌", startTime: "13:00", endTime: "14:00", category: "spiritual", description: "যোহরের নামাজ আদায় করা" },
    { id: 4, name: "আসর নামাজ", emoji: "🕌", startTime: "16:00", endTime: "17:00", category: "spiritual", description: "আসরের নামাজ আদায় করা" },
    { id: 5, name: "চাকরির প্রস্তুতি", emoji: "💼", startTime: "17:00", endTime: "18:00", category: "work", description: "চাকরির জন্য প্রস্তুতি" },
    { id: 6, name: "মাগরিব নামাজ", emoji: "🕌", startTime: "18:30", endTime: "19:00", category: "spiritual", description: "মাগরিবের নামাজ আদায় করা" },
    { id: 7, name: "ইশা নামাজ", emoji: "🕌", startTime: "20:00", endTime: "20:30", category: "spiritual", description: "ইশার নামাজ আদায় করা" },
    { id: 8, name: "লারাভেল প্র্যাকটিস", emoji: "💻", startTime: "21:00", endTime: "22:00", category: "study", description: "লারাভেল প্রজেক্ট প্র্যাকটিস" },
    { id: 9, name: "১১টার মধ্যে ঘুমানো", emoji: "😴", startTime: "23:00", endTime: "07:00", category: "health", description: "রাত ১১টার মধ্যে ঘুমানো" },
    { id: 10, name: "ফোন ব্যবহার ≤ ২ ঘণ্টা", emoji: "📱", startTime: "", endTime: "", category: "personal", description: "ফোন ব্যবহার কম রাখা" },
    { id: 11, name: "সক্রিয়ভাবে পড়া ও শোনা", emoji: "👂", startTime: "", endTime: "", category: "personal", description: "মনোযোগ সহকারে পড়াশোনা করা" },
    { id: 12, name: "বুঝে কথা বলা", emoji: "🗣️", startTime: "", endTime: "", category: "personal", description: "পরিষ্কারভাবে কথা বলা" },
    { id: 13, name: "সময়মতো খাওয়া", emoji: "🍽️", startTime: "08:00", endTime: "09:00", category: "health", description: "নিয়মিত সময়ে খাওয়া" },
    { id: 14, name: "খারাপ অভ্যাস এড়ানো", emoji: "🚫", startTime: "", endTime: "", category: "personal", description: "খারাপ অভ্যাস ত্যাগ করা" },
    { id: 15, name: "ইতিবাচক থাকা", emoji: "😊", startTime: "", endTime: "", category: "personal", description: "ইতিবাচক চিন্তা করা" }
];

// হ্যাবিট ট্র্যাকার অ্যাপ্লিকেশন
class HabitTracker {
    constructor() {
        this.currentDate = new Date();
        this.viewingDate = new Date();
        this.habits = [];
        this.isInitialized = false;
        this.confirmationCallback = null;
        this.confirmationData = null;
        
        // ইভেন্ট লিসেনার বাইন্ড করা
        this.init = this.init.bind(this);
        this.toggleHabit = this.toggleHabit.bind(this);
        this.toggleAllHabits = this.toggleAllHabits.bind(this);
        this.navigateToPreviousDay = this.navigateToPreviousDay.bind(this);
        this.navigateToToday = this.navigateToToday.bind(this);
        this.openAddHabitModal = this.openAddHabitModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openHistoryModal = this.openHistoryModal.bind(this);
        this.saveHabit = this.saveHabit.bind(this);
        this.setupEmojiPicker = this.setupEmojiPicker.bind(this);
        this.editHabit = this.editHabit.bind(this);
        this.deleteHabit = this.deleteHabit.bind(this);
        this.confirmAction = this.confirmAction.bind(this);
        this.showConfirmation = this.showConfirmation.bind(this);
    }
    
    // অ্যাপ্লিকেশন ইনিশিয়ালাইজ করা
    init() {
        console.log("হ্যাবিট ট্র্যাকার শুরু হচ্ছে...");
        
        // লোকাল স্টোরেজ থেকে ডেটা লোড করা
        this.loadFromLocalStorage();
        
        // UI আপডেট করা
        this.updateUI();
        
        // ইভেন্ট লিসেনার সেটআপ করা
        this.setupEventListeners();
        
        // সাফল্য বারান্দা দেখানো (প্রথম বার)
        if (!localStorage.getItem('habitTrackerFirstRun')) {
            setTimeout(() => {
                this.showSuccess("হ্যাবিট ট্র্যাকারে স্বাগতম! হ্যাবিট চেক করতে ক্লিক করুন।");
                localStorage.setItem('habitTrackerFirstRun', 'true');
            }, 1000);
        }
        
        this.isInitialized = true;
        console.log("হ্যাবিট ট্র্যাকার সফলভাবে শুরু হয়েছে");
    }
    
    // লোকাল স্টোরেজ থেকে ডেটা লোড করা
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('habitTrackerData');
            
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.habits = parsed.habits || [];
                console.log(`লোকাল স্টোরেজ থেকে ${this.habits.length} টি হ্যাবিট লোড করা হয়েছে`);
            } else {
                // কোনো ডেটা না থাকলে ডিফল্ট হ্যাবিট লোড করা
                this.loadDefaultHabits();
            }
        } catch (error) {
            console.error("লোকাল স্টোরেজ থেকে ডেটা লোড করতে সমস্যা:", error);
            this.loadDefaultHabits();
        }
    }
    
    // ডিফল্ট হ্যাবিট লোড করা
    loadDefaultHabits() {
        console.log("ডিফল্ট হ্যাবিট লোড করা হচ্ছে...");
        
        // ডিফল্ট হ্যাবিট কপি করা
        this.habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
        
        // প্রতিটি হ্যাবিটের জন্য history অবজেক্ট যোগ করা
        this.habits.forEach(habit => {
            habit.history = {};
            
            // ডেমো ডেটা: আজকের কিছু হ্যাবিট চেক করা
            const todayKey = this.formatDateKey(new Date());
            const demoHabits = [1, 3, 6, 9, 12, 14];
            
            if (demoHabits.includes(habit.id)) {
                habit.history[todayKey] = true;
            }
        });
        
        // লোকাল স্টোরেজে সেভ করা
        this.saveToLocalStorage();
        console.log(`${this.habits.length} টি ডিফল্ট হ্যাবিট লোড করা হয়েছে`);
    }
    
    // লোকাল স্টোরেজে ডেটা সেভ করা
    saveToLocalStorage() {
        try {
            const data = {
                habits: this.habits,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('habitTrackerData', JSON.stringify(data));
            console.log("ডেটা লোকাল স্টোরেজে সেভ করা হয়েছে");
        } catch (error) {
            console.error("ডেটা সেভ করতে সমস্যা:", error);
        }
    }
    
    // তারিখ কী ফরম্যাট করা
    formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // তারিখ প্রদর্শন করা
    formatDateDisplay(date) {
        const isToday = this.isSameDay(date, new Date());
        const isYesterday = this.isSameDay(date, new Date(Date.now() - 86400000));
        
        // বাংলা মাস এবং দিনের নাম
        const banglaMonths = [
            "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
            "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
        ];
        
        const banglaDays = [
            "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
        ];
        
        const dayOfWeek = banglaDays[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = banglaMonths[date.getMonth()];
        const year = date.getFullYear();
        
        if (isToday) {
            return `আজ, ${dayOfMonth} ${month} ${year}`;
        } else if (isYesterday) {
            return `গতকাল, ${dayOfMonth} ${month} ${year}`;
        } else {
            return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
        }
    }
    
    // দুটি তারিখ একই দিন কিনা চেক করা
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    // টাইম ফরম্যাট করা
    formatTime(time) {
        if (!time || time === "") return "";
        
        const [hour, minute] = time.split(':');
        const hourInt = parseInt(hour);
        
        if (hourInt === 0) {
            return `12:${minute} AM`;
        } else if (hourInt < 12) {
            return `${hourInt}:${minute} AM`;
        } else if (hourInt === 12) {
            return `12:${minute} PM`;
        } else {
            return `${hourInt - 12}:${minute} PM`;
        }
    }
    
    // টাইম রেঞ্জ পাওয়া
    getTimeRange(startTime, endTime) {
        if (!startTime && !endTime) return "";
        if (startTime && !endTime) return `শুরু: ${this.formatTime(startTime)}`;
        if (!startTime && endTime) return `শেষ: ${this.formatTime(endTime)}`;
        return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
    }
    
    // ক্যাটেগরি বাংলায় কনভার্ট করা
    getCategoryName(category) {
        const categoryMap = {
            'spiritual': 'আধ্যাত্মিক',
            'study': 'পড়াশোনা',
            'work': 'কাজ',
            'health': 'স্বাস্থ্য',
            'personal': 'ব্যক্তিগত',
            'other': 'অন্যান্য'
        };
        
        return categoryMap[category] || category;
    }
    
    // ক্যাটেগরি ক্লাস নাম
    getCategoryClass(category) {
        return `category-${category}`;
    }
    
    // আজকের অগ্রগতি গণনা করা
    getTodayProgress() {
        const dateKey = this.formatDateKey(this.viewingDate);
        let completed = 0;
        
        this.habits.forEach(habit => {
            if (habit.history && habit.history[dateKey]) {
                completed++;
            }
        });
        
        const total = this.habits.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { completed, total, percentage };
    }
    
    // বর্তমান স্ট্রীক গণনা করা
    getCurrentStreak() {
        let streak = 0;
        const today = new Date();
        let checkDate = new Date(today);
        
        while (streak < 30) { // সর্বোচ্চ ৩০ দিন
            const dateKey = this.formatDateKey(checkDate);
            let dayCompleted = 0;
            
            this.habits.forEach(habit => {
                if (habit.history && habit.history[dateKey]) {
                    dayCompleted++;
                }
            });
            
            // যদি কমপক্ষে ১টি হ্যাবিট সম্পন্ন হয়
            if (dayCompleted > 0) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    // UI আপডেট করা
    updateUI() {
        this.updateDateDisplay();
        this.updateHabitsList();
        this.updateStats();
        this.updateProgressBar();
    }
    
    // তারিখ প্রদর্শন আপডেট করা
    updateDateDisplay() {
        const dateDisplay = document.getElementById('current-date-display');
        const dateLabel = document.getElementById('date-label');
        
        if (dateDisplay) {
            dateDisplay.textContent = this.formatDateDisplay(this.viewingDate);
            
            if (dateLabel) {
                if (this.isSameDay(this.viewingDate, new Date())) {
                    dateLabel.textContent = "আজকের তারিখ";
                } else {
                    dateLabel.textContent = "পূর্ববর্তী তারিখ";
                }
            }
        }
    }
    
    // হ্যাবিট লিস্ট আপডেট করা
    updateHabitsList() {
        const habitsList = document.getElementById('habits-list');
        if (!habitsList) return;
        
        // কন্টেইনার খালি করা
        habitsList.innerHTML = '';
        
        // যদি কোনো হ্যাবিট না থাকে
        if (this.habits.length === 0) {
            habitsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h5>কোনো হ্যাবিট নেই</h5>
                    <p>নতুন হ্যাবিট যোগ করতে উপরের "হ্যাবিট যোগ" বাটনে ক্লিক করুন</p>
                </div>
            `;
            return;
        }
        
        const dateKey = this.formatDateKey(this.viewingDate);
        
        // হ্যাবিটগুলো সাজানো (সময় অনুযায়ী)
        const sortedHabits = [...this.habits].sort((a, b) => {
            // যেসব হ্যাবিটের সময় আছে সেগুলো প্রথমে
            if (a.startTime && !b.startTime) return -1;
            if (!a.startTime && b.startTime) return 1;
            if (a.startTime && b.startTime) {
                return a.startTime.localeCompare(b.startTime);
            }
            // সময় না থাকলে নাম অনুযায়ী
            return a.name.localeCompare(b.name);
        });
        
        // প্রতিটি হ্যাবিটের জন্য আইটেম তৈরি করা
        sortedHabits.forEach(habit => {
            const isCompleted = habit.history && habit.history[dateKey];
            const timeRange = this.getTimeRange(habit.startTime, habit.endTime);
            
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            habitItem.innerHTML = `
                <div class="habit-checkbox ${isCompleted ? 'checked' : ''}" 
                     data-habit-id="${habit.id}">
                    <i class="fas fa-check"></i>
                </div>
                <div class="habit-details">
                    <div class="habit-name">
                        <span class="habit-emoji">${habit.emoji}</span>
                        <span>${habit.name}</span>
                    </div>
                    ${timeRange ? `<div class="habit-time">${timeRange}</div>` : ''}
                    ${habit.category ? `<div class="category-badge ${this.getCategoryClass(habit.category)}">${this.getCategoryName(habit.category)}</div>` : ''}
                </div>
                <div class="habit-actions">
                    <button class="habit-action-btn edit" data-habit-id="${habit.id}" title="এডিট করুন">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="habit-action-btn delete" data-habit-id="${habit.id}" title="ডিলিট করুন">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            habitsList.appendChild(habitItem);
            
            // চেকবক্সে ক্লিক ইভেন্ট যোগ করা
            const checkbox = habitItem.querySelector('.habit-checkbox');
            checkbox.addEventListener('click', () => {
                this.toggleHabit(habit.id);
            });
            
            // এডিট বাটনে ইভেন্ট যোগ করা
            const editBtn = habitItem.querySelector('.edit');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editHabit(habit.id);
            });
            
            // ডিলিট বাটনে ইভেন্ট যোগ করা
            const deleteBtn = habitItem.querySelector('.delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showConfirmation(
                    `আপনি কি "${habit.name}" হ্যাবিটটি ডিলিট করতে চান?`,
                    () => this.deleteHabit(habit.id)
                );
            });
        });
        
        // টগল অল বাটনের টেক্সট আপডেট করা
        const toggleAllBtn = document.getElementById('toggle-all-btn');
        if (toggleAllBtn) {
            const allCompleted = this.areAllHabitsCompleted();
            const icon = allCompleted ? 'fa-times' : 'fa-check-double';
            const text = allCompleted ? 'সব হ্যাবিট আনচেক' : 'সব হ্যাবিট চেক';
            
            toggleAllBtn.innerHTML = `<i class="fas ${icon}"></i>${text}`;
        }
    }
    
    // সব হ্যাবিট কমপ্লিট কিনা চেক করা
    areAllHabitsCompleted() {
        const dateKey = this.formatDateKey(this.viewingDate);
        return this.habits.every(habit => 
            habit.history && habit.history[dateKey]
        );
    }
    
    // স্ট্যাটস আপডেট করা
    updateStats() {
        const progress = this.getTodayProgress();
        
        document.getElementById('completed-today').textContent = progress.completed;
        document.getElementById('total-habits').textContent = this.habits.length;
        document.getElementById('current-streak').textContent = this.getCurrentStreak();
    }
    
    // প্রগ্রেস বার আপডেট করা
    updateProgressBar() {
        const progress = this.getTodayProgress();
        
        // প্রগ্রেস বার
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress.percentage}%`;
        }
        
        // প্রগ্রেস টেক্সট
        document.getElementById('progress-completed').textContent = `${progress.completed} সম্পন্ন`;
        document.getElementById('progress-total').textContent = `${progress.total} মোট`;
        
        // সাবটাইটেল আপডেট
        const subtitle = document.getElementById('progress-subtitle');
        if (subtitle) {
            if (progress.percentage === 100) {
                subtitle.textContent = 'অভিনন্দন! আপনি সব হ্যাবিট সম্পন্ন করেছেন! 🎉';
                subtitle.style.color = 'var(--success-color)';
                subtitle.style.fontWeight = '600';
            } else if (progress.percentage >= 70) {
                subtitle.textContent = 'দারুণ কাজ চলছে! সামনের দিকে এগিয়ে যান!';
            } else if (progress.percentage >= 40) {
                subtitle.textContent = 'ভালো করছেন, চালিয়ে যান!';
            } else if (progress.percentage > 0) {
                subtitle.textContent = 'চলুন, আরেকটু চেষ্টা করুন!';
            } else {
                subtitle.textContent = 'আজকের হ্যাবিট শুরু করুন!';
            }
        }
    }
    
    // হ্যাবিট টগল করা
    toggleHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;
        
        const dateKey = this.formatDateKey(this.viewingDate);
        
        // history অবজেক্ট নিশ্চিত করা
        if (!habit.history) {
            habit.history = {};
        }
        
        // টগল করা
        if (habit.history[dateKey]) {
            delete habit.history[dateKey];
        } else {
            habit.history[dateKey] = true;
        }
        
        // লোকাল স্টোরেজে সেভ করা
        this.saveToLocalStorage();
        
        // UI আপডেট করা
        this.updateUI();
        
        // অ্যানিমেশন যোগ করা
        const checkbox = document.querySelector(`[data-habit-id="${habitId}"]`);
        if (checkbox) {
            checkbox.classList.add('pulse');
            setTimeout(() => checkbox.classList.remove('pulse'), 300);
        }
        
        // সাফল্য বারান্দা
        const action = habit.history[dateKey] ? 'সম্পন্ন' : 'অসম্পন্ন';
        this.showSuccess(`${habit.name} ${action} করা হয়েছে`);
    }
    
    // সব হ্যাবিট টগল করা
    toggleAllHabits() {
        const dateKey = this.formatDateKey(this.viewingDate);
        const allCompleted = this.areAllHabitsCompleted();
        
        this.habits.forEach(habit => {
            // history অবজেক্ট নিশ্চিত করা
            if (!habit.history) {
                habit.history = {};
            }
            
            if (allCompleted) {
                delete habit.history[dateKey];
            } else {
                habit.history[dateKey] = true;
            }
        });
        
        // লোকাল স্টোরেজে সেভ করা
        this.saveToLocalStorage();
        
        // UI আপডেট করা
        this.updateUI();
        
        // সাফল্য বারান্দা
        const action = allCompleted ? 'আনচেক' : 'চেক';
        this.showSuccess(`সব হ্যাবিট ${action} করা হয়েছে`);
    }
    
    // পূর্বের দিনে যাওয়া
    navigateToPreviousDay() {
        const newDate = new Date(this.viewingDate);
        newDate.setDate(newDate.getDate() - 1);
        this.viewingDate = newDate;
        this.updateUI();
        this.showSuccess("গতকালের হ্যাবিট দেখানো হচ্ছে");
    }
    
    // আজকের তারিখে ফেরত যাওয়া
    navigateToToday() {
        this.viewingDate = new Date();
        this.updateUI();
        this.showSuccess("আজকের হ্যাবিট দেখানো হচ্ছে");
    }
    
    // হ্যাবিট যোগ মোডাল খোলা
    openAddHabitModal() {
        // মোডাল টাইটেল সেট করা
        document.getElementById('modal-title').textContent = 'নতুন হ্যাবিট যোগ করুন';
        document.getElementById('modal-submit-btn').textContent = 'হ্যাবিট সংরক্ষণ করুন';
        
        // ফর্ম রিসেট করা
        document.getElementById('habit-form').reset();
        document.getElementById('habit-id').value = '';
        document.getElementById('selected-emoji').value = '📝';
        
        // এমোজি পিকার সেটআপ করা
        this.setupEmojiPicker();
        
        // মোডাল দেখানো
        document.getElementById('habit-modal').style.display = 'flex';
    }
    
    // এমোজি পিকার সেটআপ করা
    setupEmojiPicker() {
        const emojiOptions = document.querySelectorAll('.emoji-option');
        const selectedEmojiInput = document.getElementById('selected-emoji');
        
        // আগের সিলেকশন সরানো
        emojiOptions.forEach(option => option.classList.remove('selected'));
        
        // প্রতিটি এমোজিতে ক্লিক ইভেন্ট যোগ করা
        emojiOptions.forEach(option => {
            option.addEventListener('click', () => {
                // সব সিলেকশন সরানো
                emojiOptions.forEach(opt => opt.classList.remove('selected'));
                
                // এই এমোজি সিলেক্ট করা
                option.classList.add('selected');
                selectedEmojiInput.value = option.dataset.emoji;
            });
        });
        
        // প্রথম এমোজি ডিফল্ট হিসেবে সিলেক্ট করা
        if (emojiOptions.length > 0) {
            emojiOptions[0].classList.add('selected');
        }
    }
    
    // হ্যাবিট এডিট মোডাল খোলা
    editHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;
        
        // মোডাল টাইটেল সেট করা
        document.getElementById('modal-title').textContent = 'হ্যাবিট এডিট করুন';
        document.getElementById('modal-submit-btn').textContent = 'হ্যাবিট আপডেট করুন';
        
        // ফর্ম পপুলেট করা
        document.getElementById('habit-id').value = habit.id;
        document.getElementById('habit-name').value = habit.name;
        document.getElementById('selected-emoji').value = habit.emoji;
        document.getElementById('start-time').value = habit.startTime || '';
        document.getElementById('end-time').value = habit.endTime || '';
        document.getElementById('habit-description').value = habit.description || '';
        document.getElementById('habit-category').value = habit.category || 'personal';
        
        // এমোজি সিলেক্ট করা
        const emojiOptions = document.querySelectorAll('.emoji-option');
        emojiOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.emoji === habit.emoji) {
                option.classList.add('selected');
            }
        });
        
        // মোডাল দেখানো
        document.getElementById('habit-modal').style.display = 'flex';
    }
    
    // হ্যাবিট ডিলিট করা
    deleteHabit(habitId) {
        const habitIndex = this.habits.findIndex(h => h.id === habitId);
        
        if (habitIndex !== -1) {
            const habitName = this.habits[habitIndex].name;
            this.habits.splice(habitIndex, 1);
            
            // লোকাল স্টোরেজে সেভ করা
            this.saveToLocalStorage();
            
            // UI আপডেট করা
            this.updateUI();
            
            // সাফল্য বারান্দা
            this.showSuccess(`"${habitName}" হ্যাবিট ডিলিট করা হয়েছে`);
        }
    }
    
    // হ্যাবিট সেভ করা (এডিট বা নতুন)
    saveHabit(event) {
        event.preventDefault();
        
        // ফর্ম ডেটা সংগ্রহ করা
        const id = document.getElementById('habit-id').value;
        const name = document.getElementById('habit-name').value.trim();
        const emoji = document.getElementById('selected-emoji').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const description = document.getElementById('habit-description').value.trim();
        const category = document.getElementById('habit-category').value;
        
        // ভ্যালিডেশন
        if (!name) {
            alert("দয়া করে হ্যাবিটের নাম লিখুন");
            return;
        }
        
        if (id) {
            // এডিট মোড: বিদ্যমান হ্যাবিট আপডেট করা
            const habitIndex = this.habits.findIndex(h => h.id == id);
            
            if (habitIndex !== -1) {
                this.habits[habitIndex].name = name;
                this.habits[habitIndex].emoji = emoji;
                this.habits[habitIndex].startTime = startTime;
                this.habits[habitIndex].endTime = endTime;
                this.habits[habitIndex].description = description;
                this.habits[habitIndex].category = category;
            }
        } else {
            // নতুন মোড: নতুন হ্যাবিট তৈরি করা
            // নতুন আইডি জেনারেট করা
            const newId = this.habits.length > 0 
                ? Math.max(...this.habits.map(h => h.id)) + 1 
                : 1;
            
            // নতুন হ্যাবিট তৈরি করা
            const newHabit = {
                id: newId,
                name: name,
                emoji: emoji || '📝',
                startTime: startTime,
                endTime: endTime,
                description: description,
                category: category,
                history: {}
            };
            
            // হ্যাবিট লিস্টে যোগ করা
            this.habits.push(newHabit);
        }
        
        // লোকাল স্টোরেজে সেভ করা
        this.saveToLocalStorage();
        
        // UI আপডেট করা
        this.updateUI();
        
        // মোডাল বন্ধ করা
        this.closeModal('habit-modal');
        
        // সাফল্য বারান্দা
        const message = id ? `"${name}" হ্যাবিট আপডেট করা হয়েছে` : `"${name}" হ্যাবিট যোগ করা হয়েছে`;
        this.showSuccess(message);
    }
    
    // কনফার্মেশন ডায়ালগ দেখানো
    showConfirmation(message, callback) {
        document.getElementById('confirmation-message').textContent = message;
        document.getElementById('confirmation-modal').style.display = 'flex';
        
        this.confirmationCallback = callback;
    }
    
    // কনফার্মেশন একশন
    confirmAction(isConfirmed) {
        this.closeModal('confirmation-modal');
        
        if (isConfirmed && this.confirmationCallback) {
            this.confirmationCallback();
        }
        
        this.confirmationCallback = null;
    }
    
    // ইতিহাস মোডাল খোলা
    openHistoryModal() {
        const historyContent = document.getElementById('history-content');
        
        // গত ৭ দিনের ইতিহাস তৈরি করা
        let historyHTML = '<h5 class="mb-3">গত ৭ দিনের ইতিহাস</h5>';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const dateKey = this.formatDateKey(date);
            let completed = 0;
            
            this.habits.forEach(habit => {
                if (habit.history && habit.history[dateKey]) {
                    completed++;
                }
            });
            
            const total = this.habits.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isToday = i === 0;
            const isSelected = this.isSameDay(date, this.viewingDate);
            
            historyHTML += `
                <div class="history-item ${isSelected ? 'border-primary' : ''}" 
                     style="margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${isSelected ? 'var(--primary-color)' : '#e9ecef'}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold">${this.formatDateDisplay(date)}</div>
                            <div class="small text-muted">${completed}/${total} হ্যাবিট</div>
                        </div>
                        <div>
                            <span class="badge ${percentage === 100 ? 'bg-success' : percentage >= 70 ? 'bg-primary' : 'bg-warning'}">
                                ${percentage}%
                            </span>
                            ${isToday ? '<span class="badge bg-info ms-1">আজ</span>' : ''}
                        </div>
                    </div>
                    <div class="progress-bar-container mt-2" style="height: 8px;">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary w-100 mt-2 view-day-btn" 
                            data-date="${dateKey}">
                        <i class="fas fa-eye me-1"></i>এই দিন দেখুন
                    </button>
                </div>
            `;
        }
        
        historyContent.innerHTML = historyHTML;
        
        // দিন দেখুন বাটনে ইভেন্ট যোগ করা
        document.querySelectorAll('.view-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dateKey = e.target.closest('.view-day-btn').dataset.date;
                const [year, month, day] = dateKey.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                
                this.viewingDate = date;
                this.updateUI();
                this.closeModal('history-modal');
                this.showSuccess(`${this.formatDateDisplay(date)} এর হ্যাবিট দেখানো হচ্ছে`);
            });
        });
        
        // মোডাল দেখানো
        document.getElementById('history-modal').style.display = 'flex';
    }
    
    // মোডাল বন্ধ করা
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // সাফল্য বারান্দা দেখানো
    showSuccess(message) {
        const alert = document.getElementById('success-alert');
        const text = document.getElementById('success-text');
        
        if (alert && text) {
            text.textContent = message;
            alert.style.display = 'flex';
            
            // ৩ সেকেন্ড পর লুকানো
            setTimeout(() => {
                alert.style.display = 'none';
            }, 3000);
        }
    }
    
    // ইভেন্ট লিসেনার সেটআপ করা
    setupEventListeners() {
        console.log("ইভেন্ট লিসেনার সেটআপ হচ্ছে...");
        
        // নেভিগেশন বাটন
        document.getElementById('prev-day-btn').addEventListener('click', this.navigateToPreviousDay);
        document.getElementById('today-btn').addEventListener('click', this.navigateToToday);
        
        // টগল অল বাটন
        document.getElementById('toggle-all-btn').addEventListener('click', this.toggleAllHabits);
        
        // হ্যাবিট যোগ বাটন
        document.getElementById('add-habit-btn').addEventListener('click', this.openAddHabitModal);
        
        // ইতিহাস বাটন
        document.getElementById('view-history-btn').addEventListener('click', this.openHistoryModal);
        
        // হ্যাবিট ফর্ম (এডিট/নতুন)
        document.getElementById('habit-form').addEventListener('submit', this.saveHabit);
        
        // কনফার্মেশন বাটন
        document.getElementById('confirm-yes').addEventListener('click', () => this.confirmAction(true));
        document.getElementById('confirm-no').addEventListener('click', () => this.confirmAction(false));
        
        // মোডাল ক্লোজ বাটন
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // মোডালের বাইরে ক্লিক করলে বন্ধ করা
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // কীবোর্ড শর্টকাট
        document.addEventListener('keydown', (e) => {
            // Left arrow - পূর্বের দিন
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateToPreviousDay();
            }
            
            // T - আজকে
            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                this.navigateToToday();
            }
            
            // N - নতুন হ্যাবিট
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                this.openAddHabitModal();
            }
            
            // A - সব টগল
            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                this.toggleAllHabits();
            }
            
            // H - ইতিহাস
            if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                this.openHistoryModal();
            }
            
            // Esc - মোডাল বন্ধ
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal-overlay[style*="display: flex"]');
                openModals.forEach(modal => modal.style.display = 'none');
            }
        });
        
        console.log("সব ইভেন্ট লিসেনার সেটআপ সম্পন্ন");
    }
}

// অ্যাপ্লিকেশন শুরু করা
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM লোড সম্পন্ন, অ্যাপ্লিকেশন শুরু হচ্ছে...");
    
    // হ্যাবিট ট্র্যাকার ইনস্ট্যান্স তৈরি করা
    window.habitTracker = new HabitTracker();
    
    // অ্যাপ্লিকেশন শুরু করা
    window.habitTracker.init();
    
    // ডিবাগ ইনফো
    console.log("হ্যাবিট ট্র্যাকার সক্রিয়। শর্টকাট: Left Arrow (গতকাল), T (আজ), N (নতুন হ্যাবিট), A (সব টগল), H (ইতিহাস), Esc (মোডাল বন্ধ)");
});

// সার্ভিস ওয়ার্কার রেজিস্ট্রেশন (ঐচ্ছিক)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker রেজিস্ট্রেশন ব্যর্থ: ', err);
        });
    });
}