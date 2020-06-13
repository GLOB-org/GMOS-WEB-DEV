export default [
    {
        type: 'link',
        label: 'Beranda',
        url: '/',
    },

    {
        type: 'link',
        label: 'Daftar Produk',
        url: '/',
        children: [
            { type: 'link', label: 'Langganan', url: '/daftarproduklangganan' },
            { type: 'link', label: 'Non Langganan', url: '/daftarproduknonlangganan' },
        ],
    },

    {
        type: 'link',
        label: 'Transaksi',
        url: '/',
        children: [
            { type: 'link', label: 'Daftar Transaksi', url: '/transaksi/daftartransaksi' },
            { type: 'link', label: 'Nego', url: '/transaksi/nego' },
        ],
    },

    {
        type: 'link',
        label: 'Akun',
        url: '/',
        children: [
            { type: 'link', label: 'Profile', url: '/akun/profile' },
            { type: 'link', label: 'Distributor', url: '/akun/distributor' },
            // { type: 'link', label: 'Verifikasi Akun', url: '/akun/verifikasi' }
        ],
    },

    {
        type: 'link',
        label: 'Keluar',
        url: '/masuk'
    }
];
