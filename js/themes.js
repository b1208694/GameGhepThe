/**
 * Hệ thống Chủ Đề (Themes) Đa Dạng
 * Cho phép người chơi tự do lựa chọn giao diện & biểu tượng yêu thích
 */
const GAME_THEMES = {
    vietnam_food: {
        id: 'vietnam_food',
        name: 'Ẩm thực Việt',
        badge: '🍜',
        description: 'Món ngon đường phố & đặc sản Việt Nam',
        primaryColor: '#e67e22',
        bgGradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        accentColor: '#d35400',
        items: [
            { id: 'pho', icon: '🍜', name: 'Phở Bò' },
            { id: 'banhmi', icon: '🥖', name: 'Bánh Mì' },
            { id: 'trasua', icon: '🧋', name: 'Trà Sữa' },
            { id: 'caphe', icon: '☕', name: 'Cà Phê Phin' },
            { id: 'banhbao', icon: '🥟', name: 'Bánh Bao' },
            { id: 'goicuon', icon: '🌯', name: 'Gỏi Cuốn' },
            { id: 'tomnuong', icon: '🍤', name: 'Tôm Nướng' },
            { id: 'comtam', icon: '🍖', name: 'Cơm Tấm' },
            { id: 'kemdua', icon: '🥥', name: 'Kem Dừa' },
            { id: 'xoailac', icon: '🥭', name: 'Xoài Lắc' },
            { id: 'banhxeo', icon: '🌮', name: 'Bánh Xèo' },
            { id: 'trungcut', icon: '🥚', name: 'Trứng Cút Lộn' },
            { id: 'traxanh', icon: '🍵', name: 'Trà Đá' },
            { id: 'kemque', icon: '🍦', name: 'Kem Ốc Quế' }
        ]
    },
    cute_pets: {
        id: 'cute_pets',
        name: 'Thú cưng cute',
        badge: '🐶',
        description: 'Các bé cưng siêu đáng yêu & nghịch ngợm',
        primaryColor: '#ff7675',
        bgGradient: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)',
        accentColor: '#d63031',
        items: [
            { id: 'dog', icon: '🐶', name: 'Cún Cưng' },
            { id: 'cat', icon: '🐱', name: 'Mèo Lười' },
            { id: 'rabbit', icon: '🐰', name: 'Thỏ Trắng' },
            { id: 'hamster', icon: '🐹', name: 'Hamster' },
            { id: 'panda', icon: '🐼', name: 'Gấu Trúc' },
            { id: 'fox', icon: '🦊', name: 'Cáo Con' },
            { id: 'bear', icon: '🐻', name: 'Gấu Nâu' },
            { id: 'penguin', icon: '🐧', name: 'Cánh Cụt' },
            { id: 'koala', icon: '🐨', name: 'Koala' },
            { id: 'frog', icon: '🐸', name: 'Ếch Cốm' },
            { id: 'duck', icon: '🐥', name: 'Vịt Vàng' },
            { id: 'pig', icon: '🐷', name: 'Heo Hồng' },
            { id: 'tiger', icon: '🐯', name: 'Hổ Con' },
            { id: 'chick', icon: '🐣', name: 'Gà Con' }
        ]
    },
    fresh_fruits: {
        id: 'fresh_fruits',
        name: 'Trái cây tươi',
        badge: '🍉',
        description: 'Nông trại trái cây nhiệt đới ngọt ngào',
        primaryColor: '#2ed573',
        bgGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        accentColor: '#26af5f',
        items: [
            { id: 'watermelon', icon: '🍉', name: 'Dưa Hấu' },
            { id: 'strawberry', icon: '🍓', name: 'Dâu Tây' },
            { id: 'banana', icon: '🍌', name: 'Chuối Tiêu' },
            { id: 'apple', icon: '🍎', name: 'Táo Đỏ' },
            { id: 'grape', icon: '🍇', name: 'Nho Tím' },
            { id: 'pineapple', icon: '🍍', name: 'Dứa Mật' },
            { id: 'peach', icon: '🍑', name: 'Đào Tiên' },
            { id: 'kiwi', icon: '🥝', name: 'Kiwi Xanh' },
            { id: 'avocado', icon: '🥑', name: 'Quả Bơ' },
            { id: 'cherry', icon: '🍒', name: 'Cherry' },
            { id: 'orange', icon: '🍊', name: 'Cam Sành' },
            { id: 'lemon', icon: '🍋', name: 'Chanh Vàng' },
            { id: 'coconut', icon: '🥥', name: 'Dừa Xiêm' },
            { id: 'pear', icon: '🍐', name: 'Lê Ngọt' }
        ]
    },
    sweet_bakery: {
        id: 'sweet_bakery',
        name: 'Tiệm bánh ngọt',
        badge: '🧁',
        description: 'Những món bánh kem & tráng miệng mê mẩn',
        primaryColor: '#fd79a8',
        bgGradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        accentColor: '#e84393',
        items: [
            { id: 'donut', icon: '🍩', name: 'Bánh Donut' },
            { id: 'cupcake', icon: '🧁', name: 'Cupcake' },
            { id: 'cake', icon: '🍰', name: 'Bánh Kem' },
            { id: 'cookie', icon: '🍪', name: 'Bánh Quy' },
            { id: 'pudding', icon: '🍮', name: 'Pudding' },
            { id: 'waffle', icon: '🧇', name: 'Bánh Waffle' },
            { id: 'pancake', icon: '🥞', name: 'Bánh Kẹp' },
            { id: 'croissant', icon: '🥐', name: 'Sừng Bò' },
            { id: 'chocolate', icon: '🍫', name: 'Sô-cô-la' },
            { id: 'lollipop', icon: '🍭', name: 'Kẹo Mút' },
            { id: 'candy', icon: '🍬', name: 'Kẹo Ngọt' },
            { id: 'pie', icon: '🥧', name: 'Bánh Pie' },
            { id: 'bread', icon: '🍞', name: 'Bánh Mì Gối' },
            { id: 'popcorn', icon: '🍿', name: 'Bỏng Ngô' }
        ]
    }
};

window.GAME_THEMES = GAME_THEMES;
