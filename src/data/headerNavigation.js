export default [
    
    // {
    //     title: 'Megamenu',
    //     url: '',
    //     submenu: {
    //         type: 'megamenu',
    //         menu: {
    //             size: 'nl',
    //             columns: [
    //                 {
    //                     size: 6,
    //                     links: [
    //                         {
    //                             title: 'Power Tools',
    //                             url: '',
    //                             links: [
    //                                 { title: 'Engravers', url: '' },
    //                                 { title: 'Wrenches', url: '' },
    //                                 { title: 'Wall Chaser', url: '' },
    //                                 { title: 'Pneumatic Tools', url: '' },
    //                             ],
    //                         },
    //                         {
    //                             title: 'Machine Tools',
    //                             url: '',
    //                             links: [
    //                                 { title: 'Thread Cutting', url: '' },
    //                                 { title: 'Chip Blowers', url: '' },
    //                                 { title: 'Sharpening Machines', url: '' },
    //                                 { title: 'Pipe Cutters', url: '' },
    //                                 { title: 'Slotting machines', url: '' },
    //                                 { title: 'Lathes', url: '' },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     size: 6,
    //                     links: [
    //                         {
    //                             title: 'Hand Tools',
    //                             url: '',
    //                             links: [
    //                                 { title: 'Screwdrivers', url: '' },
    //                                 { title: 'Handsaws', url: '' },
    //                                 { title: 'Knives', url: '' },
    //                                 { title: 'Axes', url: '' },
    //                                 { title: 'Multitools', url: '' },
    //                                 { title: 'Paint Tools', url: '' },
    //                             ],
    //                         },
    //                         {
    //                             title: 'Garden Equipment',
    //                             url: '',
    //                             links: [
    //                                 { title: 'Motor Pumps', url: '' },
    //                                 { title: 'Chainsaws', url: '' },
    //                                 { title: 'Electric Saws', url: '' },
    //                                 { title: 'Brush Cutters', url: '' },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     },
    // },
    // {
    //     title: 'Daftar Produk',
    //     url: '/daftarproduk',
        // submenu: {
        //     type: 'menu',
        //     menu: [
        //         {
        //             title: 'List Product',
        //             url: '/listproduct',
        //             // submenu: [
        //             //     { title: '3 Columns Sidebar', url: '/shop/category-grid-3-columns-sidebar' },
        //             //     { title: '4 Columns Full', url: '/shop/category-grid-4-columns-full' },
        //             //     { title: '5 Columns Full', url: '/shop/category-grid-5-columns-full' },
        //             // ],
        //         },
        //         // { title: 'Transaction', url: '/shop/category-list' },
        //         // { title: 'Nego', url: '/shop/category-right-sidebar' },
        //         {
        //             title: 'Transaction',
        //             url: '/transaction',
        //             submenu: [
        //                 { title: 'Transaction Progress', url: '/transactionprogress' },
        //                 { title: 'Nego', url: '/nego' }
        //             ],
        //         },
        //         // { title: 'Cart', url: '/shop/cart' },
        //         // { title: 'Checkout', url: '/shop/checkout' },
        //         // { title: 'Wishlist', url: '/shop/wishlist' },
        //         // { title: 'Compare', url: '/shop/compare' },
        //         // { title: 'Track Order', url: '/shop/track-order' },
        //     ],
        // },
    // },
    {
        title: 'Daftar Produk',
        // url: '/daftarproduk',
        // url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Langganan', url: '/daftarproduklangganan' },
                { title: 'Non Langganan', url: '/daftarproduknonlangganan' }
            ],
        },
    },
    {
        title: 'Transaksi',
        // url: '/transaksi',
        // url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Daftar Transaksi ', url: '/transaksi/daftartransaksi' },
                { title: 'Nego', url: '/transaksi/nego' }
            ],
        },
    },
    {
        title: 'Akun',
        // url: '/akun',
        // url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Profile', url: '/akun/profile' },
                { title: 'Distributor', url: '/akun/distributor' },
                // { title: 'Verifikasi Akun', url: '/akun/verifikasi' },
            ],
        },
    },
    
    // {
    //     title: 'Blog',
    //     url: '/blog/category-classic',
    //     submenu: {
    //         type: 'menu',
    //         menu: [
    //             { title: 'Blog Classic', url: '/blog/category-classic' },
    //             { title: 'Blog Grid', url: '/blog/category-grid' },
    //             { title: 'Blog List', url: '/blog/category-list' },
    //             { title: 'Blog Left Sidebar', url: '/blog/category-left-sidebar' },
    //             { title: 'Post Page', url: '/blog/post-classic' },
    //             { title: 'Post Without Sidebar', url: '/blog/post-full' },
    //         ],
    //     },
    // },
    // {
    //     title: 'Pages',
    //     url: '/site/about-us',
    //     submenu: {
    //         type: 'menu',
    //         menu: [
    //             { title: 'About Us', url: '/site/about-us' },
    //             { title: 'Contact Us', url: '/site/contact-us' },
    //             { title: 'Contact Us Alt', url: '/site/contact-us-alt' },
    //             { title: '404', url: '/site/not-found' },
    //             { title: 'Terms And Conditions', url: '/site/terms' },
    //             { title: 'FAQ', url: '/site/faq' },
    //             { title: 'Components', url: '/site/components' },
    //             { title: 'Typography', url: '/site/typography' },
    //         ],
    //     },
    // },
    // {
    //     title: 'Buy Theme',
    //     url: 'https://themeforest.net/item/stroyka-tools-store-react-ecommerce-template/23909258',
    //     props: {
    //         external: true,
    //         target: '_blank',
    //     },
    // },
];
