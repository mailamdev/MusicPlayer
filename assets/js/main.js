const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const playList = $('.playlist')

const player = $('.player')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const progress = $('#progress') 
 
var count = 0
var arrayPlayed = []

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name: 'Bước Qua Mùa Cô Đơn',
            singer: 'Vũ',
            path: './assets/music/BuocQuaMuaCoDon.mp3',
            img: './assets/img/BuocQuaMuaCoDon.jpg'
        },
        {
            name: 'Chẳng Biết Điều Gì',
            singer: 'Emcee L (Da LAB)',
            path: './assets/music/ChangBietDieuGi.mp3',
            img: './assets/img/ChangBietDieuGi.jpg'
        },
        {
            name: 'Dù Cho Mai Về Sau',
            singer: 'Buitruonglinh',
            path: './assets/music/DuChoMaiVeSau.mp3',
            img: './assets/img/DuChoMaiVeSau.jpg'
        },
        {
            name: 'Gặp Nhưng Không Ở Lại',
            singer: 'Hiền Hồ Ft. Vương Anh Tú',
            path: './assets/music/GapNhungKhongOLai.mp3',
            img: './assets/img/GapNhungKhongOLai.png'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: './assets/music/NangTho.mp3',
            img: './assets/img/NangTho.jpg'
        },
        {
            name: 'Rồi Người Thương Cũng Hóa Người Dưng',
            singer: 'Hiền Hồ',
            path: './assets/music/RoiNguoiThuongCungHoaNguoiDung.mp3',
            img: './assets/img/RoiNguoiThuongCungHoaNguoiDung.jpg'
        },
        {
            name: 'Sinh Ra Đã Là Thứ Đối Lập Nhau',
            singer: 'Emcee L (Da LAB) ft. Badbies',
            path: './assets/music/SinhRaDaLaThuDoiLapNhau.mp3',
            img: './assets/img/SinhRaDaLaThuDoiLapNhau.jpg'
        },
        {
            name: 'Tháng Mấy Em Nhớ Anh?',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/ThangMayEmNhoAnh.mp3',
            img: './assets/img/ThangMayEmNhoAnh.jpg'
        },
        {
            name: 'Tháng Năm',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/ThangNam.mp3',
            img: './assets/img/ThangNam.jpg'
        },
        {
            name: 'Thương Em Là Điều Anh Không Thể Ngờ',
            singer: 'Noo Phước Thịnh',
            path: './assets/music/ThuongEmLaDieuAnhKhongTheNgo.mp3',
            img: './assets/img/ThuongEmLaDieuAnhKhongTheNgo.jpg'
        },
        
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" >
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playList.innerHTML = htmls.join('')
    },

    // * Định nghĩa các thuộc tính cho Object
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })

    },

    // * Xử lý các sự kiện
    handleEvent: function() {
        const cdWidth = cd.offsetWidth

        // * Xử lý CD play/pause
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()


        //  * Thay đổi kích thước của CD khi scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY ||  document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        },

        // * Xử lý khi play bài hát
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
            
        }

        // * Khi bài hát được play 
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // * Khi bài hát bị pause
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // * Khi tiến dộ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // * Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // * Khi next bài hát
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } 
            else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // * Khi prev bài hát
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } 
            else {
                app.prevSong()
            }
            audio.play()
        }

        // * Xử lý random bài hát
        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
        }

        //  * Xử lý repeat 1 bài hát
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // * Xử lý next khi hết 1 bài
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click();
            }
        }

        //  * Lắng nghe hành vi Click vào Playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)') 
            if (songNode|| e.target.closest('.option')){
                // * Xử lý khi click vào bài hát
                if (e.target.closest('.song:not(.active)')) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()

                }
            } 
        }
    },

    scrollToActiveSong: function () {
        setTimeout( () => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },

    //  * Tải thông tin bài hát đầu tiên
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0)  {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length)  {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        newIndex = Math.floor(Math.random() * this.songs.length);

        if(count >0) {
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
                var isCheck= arrayPlayed.includes(newIndex);
            }
            while(isCheck == true)
        }
        arrayPlayed[count]=newIndex;
        // do {
        //     newIndex = Math.floor(Math.random() * this.songs.length)
        // } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        if(count == this.songs.length-1)
        {
            arrayPlayed=[];
            count=-1;
        }
        count++;
    },

    start: function() {
        this.loadConfig()
        this.defineProperties()
        this.handleEvent() 
        this.loadCurrentSong()
        this.render()
        //  * Hiển thị trạng thái ban đầu của button Repeat & Random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()