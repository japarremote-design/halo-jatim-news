import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Article } from '../types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuA3xrfjFmhn-PUS4B1bxeZda-cea7uQC9PqRVPAyzsKDrvIaXkLeci61XPbhICSh-85gsJY7rnG9aanIuS4IFEqmN47fOrzKBcLxjm1ygGS5CEPVy1Z6qVpLaRFfZIgda2BEcfEC5V94MCqnzniZ8i1vSsniUkr5kMK8734Ex-0nu4bK_828MLjculJ6pd0Bf0pu_OOtPzD3qcik9RH4moSrye-p-eNC_UbE3-vIuVfF-mJP109G3MNGL7qxijzIiSF2MA";

export const initialArticles: Article[] = [
  {
    id: "art-1",
    title: "Gubernur Jatim Resmikan Infrastruktur Baru di Pelosok Madura, Warga Sambut Antusias",
    category: "Madura",
    excerpt: "Pembangunan jalan tol dan jembatan baru diharapkan mampu mendongkrak perekonomian lokal dan mempermudah akses distribusi barang di wilayah kepulauan.",
    content: `SURABAYA, HALOJATIMNEWS - Upaya pemerataan pembangunan di Provinsi Jawa Timur terus digenjot. Hari ini, Gubernur Jawa Timur secara resmi membuka serangkaian proyek infrastruktur krusial yang menghubungkan desa-desa terpencil di wilayah Madura. Peresmian ini diharapkan menjadi katalisator pertumbuhan ekonomi lokal.

Dalam sambutannya, beliau menekankan bahwa pembangunan tidak boleh hanya berpusat di wilayah perkotaan. "Keadilan sosial berarti akses yang sama terhadap jalan yang layak, jembatan yang kokoh, dan fasilitas umum yang memadai bagi seluruh warga Jawa Timur, tanpa terkecuali," tegasnya di hadapan ratusan warga yang hadir.

"Jalan ini bukan sekadar aspal dan batu, ini adalah urat nadi ekonomi baru bagi masyarakat desa."

Proyek yang menelan anggaran daerah senilai puluhan miliar rupiah ini mencakup perbaikan jalan kabupaten sepanjang 15 kilometer, pembangunan dua jembatan penghubung antar kecamatan, serta instalasi penerangan jalan umum berbasis tenaga surya. Masyarakat setempat yang selama ini kesulitan mengangkut hasil pertanian kini dapat bernapas lega.

Pak Hasan, salah seorang tokoh masyarakat desa setempat, menyampaikan rasa syukurnya. "Dulu kalau musim hujan, jalanan ini lumpur semua. Hasil panen jagung susah dibawa ke pasar, ongkosnya jadi mahal. Sekarang alhamdulillah, jalan mulus, ekonomi desa pasti ikut lancar," ungkapnya dengan wajah semringah.`,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP0K_vlXFatPBzDF2w1n_eXYEprGkbsJG5Evw66XZV0U52dmGmlJYU0FnNQRffemMYsnom6mhIOlp7QmsuHaX-Do3rc0EOLMOl1PdLST6zSNHviOXoSRvDKBz9Ts2-wUlAUyitYKe7ohunDSpeKl05uoDsWLvKrmyFFoXxRZe8PEtRaRNGeFIS4G4KdHPNZpJaHmRXyR-w3bj74cnwSjb3cfFS6cVWB9tsTn05ibwCZJjqAk-PNY-NZg",
    imageCaption: "Foto: Dok. HaloJatimNews",
    author: "Redaksi HaloJatim",
    authorRole: "Tim Redaksi Utama",
    createdAt: new Date("2026-08-04T14:30:00Z").toISOString(),
    views: 1420,
    likes: 382,
    tags: ["Infrastruktur", "Madura", "Pemprov Jatim"],
    isHero: true,
    isTrending: true
  },
  {
    id: "art-2",
    title: "Harga Kebutuhan Pokok Mulai Stabil Jelang Akhir Tahun",
    category: "Jawa Timur",
    excerpt: "Pantauan dinas perdagangan di pasar-pasar tradisional Surabaya menunjukkan tren penurunan harga beras, beras premium, dan bumbu dapur.",
    content: `SURABAYA - Pasokan komoditas pangan pokok di Jawa Timur dipastikan dalam kondisi aman dan harga terpantau stabil menjelang penutupan tahun ini.

Operasi pasar murah yang digelar secara kontinyu di berbagai kabupaten/kota terbukti efektif menekan lonjakan inflasi daerah.

Masyarakat menyambut positif kestabilan harga ini, terutama komoditas beras, gula pasir, dan minyak goreng yang menjadi kebutuhan harian rumah tangga.`,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBt8rcGwqh5H8azkGPSt5lE_Xoz2bDpphUq0ML9Cw_cnvdPv5QpRh81PIqHx2nUCmB88Z73cYaT-UrVMYhlJBMfPrBQhd0FvahOd_76z-mC5EaFjlNP0v4zRmBxjRIDJwe8FnBYJ4LnzJgPAN2Zpfwv9ltm25IQw0eOVdI0DkpkD7c0GN0apS6xaQErX_GJ3_Y4yuJ6OCQLCY_Nc-TOFaE0amjonNU2F80eLin3-wjWyyf433-DWsAxcw",
    author: "Budi Santoso",
    authorRole: "Jurnalis Ekonomi",
    createdAt: new Date("2026-08-05T00:15:00Z").toISOString(),
    views: 890,
    likes: 124,
    tags: ["Pasar", "Sembako", "Surabaya"],
    isTrending: true
  },
  {
    id: "art-3",
    title: "Fasilitas Kesehatan Baru Diresmikan di Malang Selatan",
    category: "Jawa Timur",
    excerpt: "Rumah sakit pratama berteknologi modern siap melayani ribuan warga pesisir selatan tanpa perlu menempuh jarak jauh ke pusat kota.",
    content: `MALANG - Warga Malang Selatan kini tidak perlu lagi menempuh rute berjam-jam untuk mendapatkan akses layanan medis spesialis.

Fasilitas kesehatan lengkap dengan instalasi gawat darurat 24 jam dan ruang rawat inap standar nasional secara resmi mulai beroperasi hari ini.

Proyek ini merupakan komitmen prioritas bidang kesehatan untuk menjamin kesejahteraan warga pelosok daerah.`,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHYwpPVoSiuBoh_I3RCxofnrPa731HU8J8W28VkRu9qFJZSaiS4KWLMXUr_BS1r5R2MgO_z54a3TKcKVMDXm9VRZ_1jKMWPZOPUJWF9u-mnSYPK38sT64w-nv3F7EptAjn7rLNN_3bBZigpFe7WRQMedQ4eZzOl7T219L19HY375FOnjgHk--k6LbDtn7krDs8WBHr62Ofwn2kIqd6Gvh-E5KpZF1FRjMK7MEAU6J2VNrsjPtCeVNJPg",
    author: "Siti Rahma",
    authorRole: "Kontributor Malang",
    createdAt: new Date("2026-08-04T22:00:00Z").toISOString(),
    views: 650,
    likes: 98,
    tags: ["Kesehatan", "Malang", "Layanan Publik"]
  },
  {
    id: "art-4",
    title: "Peta Koalisi Partai Jelang Pemilihan Kepala Daerah Mulai Terlihat",
    category: "Politik",
    excerpt: "Sejumlah pimpinan partai politik di Jawa Timur intensif menggelar pertemuan tertutup guna mematangkan rekomendasi calon gubernur.",
    content: `SURABAYA - Dinamika politik lokal Jawa Timur kian hangat mendekati pesta demokrasi pilkada serentak.

Konsolidasi antar lintas partai politik terus digencarkan untuk merumuskan visi pasangan calon pimpinan daerah yang responsif terhadap aspirasi rakyat.

Para pengamat menilai koalisi yang terbentuk akan ditentukan oleh rekam jejak pembangunan serta program strategis yang berpihak pada kesejahteraan ekonomi kerakyatan.`,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApgLMPXY1FhFM0yu5ncwf_0whxvoBGSPHHQ4fT3hMsRqwjhhF36R-YYbDqhyvacQehcSOVC10C_MAKWc7lpl0NZpHmQ08hrAUfM4WnkcGe_uYK_SFNUBfbNcMuIEtrw6KefsXbiD24foey7V6mJty_K68vk2e14Yc_bFnLEBBGz45em7MyS4O-2tGP_N5bdU4zHoo5WnT99ULS8rBjT2OZF272w_AS6oL3jcr_I2c1Tv_TRHNMPWSrlQ",
    author: "Rizal Prabowo",
    authorRole: "Editor Politik",
    createdAt: new Date("2026-08-04T21:00:00Z").toISOString(),
    views: 1120,
    likes: 210,
    tags: ["Pilkada", "Politik Jatim", "Koalisi"],
    isTrending: true
  },
  {
    id: "art-5",
    title: "Polisi Ungkap Sindikat Penipuan Online Lintas Provinsi",
    category: "Hukum",
    excerpt: "Polda Jatim berhasil mengamankan barang bukti kejahatan siber senilai ratusan juta rupiah dari penggerebekan marka rahasia.",
    content: `SURABAYA - Tim Subdit Siber Ditreskrimsus Polda Jawa Timur membongkar jaringan tindak pidana penipuan berbasis daring yang menargetkan korban secara acak.

Masyarakat diimbau untuk selalu waspada dan tidak mudah tergiur dengan iming-iming investasi berantai atau pesan singkat mencurigakan.`,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    author: "Tim Hukum & Kriminal",
    createdAt: new Date("2026-08-03T18:00:00Z").toISOString(),
    views: 780,
    likes: 145,
    tags: ["Hukum", "Siber", "Polda Jatim"]
  },
  {
    id: "art-6",
    title: "Inovasi Pertanian Organik Desa Sukamaju Tingkatkan Pendapatan Warga",
    category: "Desa",
    excerpt: "Penggunaan pupuk buatan BUMDes lokal berhasil mendongkrak tonase panen padi hingga 35 persen dibanding musim sebelumnya.",
    content: `JEMBER - Desa Sukamaju menjadi salah satu contoh keberhasilan kemandirian pangan berbasis komunitas BUMDes.

Dengan beralih ke pola budidaya padi organik terpadu, kualitas beras yang dihasilkan lebih premium dan dipasarkan langsung ke jaringan ritel regional.`,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqihl5fA8H0D7YhJEUmVWnga6GojBh7SM0Uv9fIhry15XzPq6W_NFb34L8huxkioabWY1cDI6GPc-iCnzGPzUx9zEvjbtD6fWLmk0HXeZDEJJB2ZoguqtBylB-6wd-rMOG7ijEAHjpG3xTprXRkz3SwnlF9NFGnXZc-hiAYKE85O-A9daTHnDrJMwPbljh8bUfGbuL3gt_snA1NwhEJuMW9k6etieIMwpdCB5PT20wDXlXjcaRRiSpCQ",
    author: "Ahmad Dahlan",
    authorRole: "Reporter Desa",
    createdAt: new Date("2026-08-04T12:00:00Z").toISOString(),
    views: 940,
    likes: 310,
    tags: ["Desa", "BUMDes", "Pertanian"]
  },
  {
    id: "art-7",
    title: "Masa Depan Pendidikan Vokasi di Era Digitalisasi Industri Jawa Timur",
    category: "Keislaman",
    excerpt: "Transformasi pesantren dan sekolah vokasi berbasis teknologi tinggi menjadi kunci mencetak SDM unggul di kawasan industri modern.",
    content: `Transformasi digital harus diimbangi dengan karakter moral yang kuat dan keterampilan praktis yang sesuai dengan standar industri global...`,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Ahmad Budiarto",
    authorRole: "Pemerhati Pendidikan Jatim",
    createdAt: new Date("2026-08-04T08:00:00Z").toISOString(),
    views: 1250,
    likes: 420,
    tags: ["Opini", "Pendidikan", "Digitalisasi"],
    isOpinion: true,
    opinionAuthor: "Dr. Ahmad Budiarto",
    opinionRole: "Pakar Pendidikan & Pesantren"
  },
  {
    id: "art-8",
    title: "Tantangan Ekologi: Menjaga Keseimbangan Pembangunan dan Lingkungan",
    category: "Keislaman",
    excerpt: "Pembangunan berkelanjutan memerlukan etika pelestarian alam yang terintegrasi dengan kearifan lokal masyarakat Jawa Timur.",
    content: `Pembangunan fisik daerah harus selaras dengan daya dukung ekosistem sungai dan hutan pelindung demi mencegah bencana alam tahunan...`,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    author: "Siti Rahma, M.Si",
    authorRole: "Peneliti Ekologi",
    createdAt: new Date("2026-08-03T10:00:00Z").toISOString(),
    views: 890,
    likes: 195,
    tags: ["Opini", "Lingkungan"],
    isOpinion: true,
    opinionAuthor: "Siti Rahma, M.Si",
    opinionRole: "Pemerhati Ekologi Sosial"
  }
];

export async function seedInitialArticlesIfEmpty() {
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
    if (querySnapshot.empty) {
      console.log('Seeding initial news articles into Firestore...');
      for (const article of initialArticles) {
        await setDoc(doc(db, 'articles', article.id), article);
      }
      console.log('Seeding completed successfully!');
    }
  } catch (error) {
    console.error('Error seeding articles to Firestore:', error);
  }
}
