import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Font loaders from @expo-google-fonts
import {
  useFonts,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic
} from '@expo-google-fonts/instrument-serif';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold
} from '@expo-google-fonts/instrument-sans';

import { Header } from './src/components/Header';
import { MobileBottomNav } from './src/components/MobileBottomNav';
import { Home } from './src/pages/Home';
import { Explore } from './src/pages/Explore';
import { ListingDetail } from './src/pages/ListingDetail';
import { Cart } from './src/pages/Cart';
import { Login } from './src/pages/Login';
import { Chat } from './src/pages/Chat';
import { Listing, CartItem } from './src/types';
import { Theme } from './src/theme';

const T: any = {
  en: {
    tagline: 'Local Fashion',
    searchPh: 'Search silk, kurta, tailor…',
    searchBtn: 'Go',
    offersLabel: 'Offers',
    offer1: 'ARLI10 — 10% off first order',
    offer2: '1 point per ₹100',
    featuredTitle: 'Featured near you',
    viewAll: 'View all',
    pincodePh: 'Pincode',
    anyPrice: 'Any price',
    under: 'Under',
    resultsFound: 'results near you',
    noResults: 'No listings match — try clearing filters.',
    sponsored: 'Sponsored',
    backToExplore: 'Back to Explore',
    reviewsWord: 'reviews',
    qtyMeters: 'Meters',
    qtyPieces: 'Quantity',
    subtotal: 'Subtotal',
    attachMeas: 'Attach my measurements',
    addToCart: 'Add to cart',
    chatWithShop: 'Chat with shop',
    payAtShop: 'Pay at shop on delivery · Razorpay coming soon',
    cartTitle: 'Your cart',
    measAttached: 'Measurements attached',
    remove: 'Remove',
    promoPh: 'Promo code (try ARLI10)',
    apply: 'Apply',
    discount: 'Discount',
    total: 'Total',
    cartEmpty: 'Your cart is empty.',
    startShopping: 'Start shopping',
    checkoutProceed: 'Proceed to checkout',
    loginTitle: 'Welcome back',
    loginSub: 'Login or create an account with your phone number.',
    phoneLabel: 'Phone number',
    sendOtp: 'Send OTP',
    or: 'or',
    googleBtn: 'Continue with Google',
    devfrogsBtn: 'Continue with Devfrogs',
    otpTitle: 'Enter OTP',
    otpSub: 'We sent a 4-digit code to',
    verify: 'Verify & continue',
    changeNumber: 'Change number',
    online: 'Online',
    shareMeas: 'Share measurements',
    chatPh: 'Type a message…',
  },
  hi: {
    tagline: 'लोकल फ़ैशन',
    searchPh: 'सिल्क, कुर्ता, दर्ज़ी खोजें…',
    searchBtn: 'खोजें',
    offersLabel: 'ऑफ़र',
    offer1: 'ARLI10 — पहले ऑर्डर पर 10% छूट',
    offer2: 'हर ₹100 पर 1 पॉइंट',
    featuredTitle: 'आपके पास के चुनिंदा',
    viewAll: 'सभी देखें',
    pincodePh: 'पिनकोड',
    anyPrice: 'कोई भी क़ीमत',
    under: 'तक',
    resultsFound: 'नतीजे आपके पास',
    noResults: 'कोई लिस्टिंग नहीं मिली — फ़िल्टर हटाएँ।',
    sponsored: 'प्रायोजित',
    backToExplore: 'वापस खोजें पर',
    reviewsWord: 'समीक्षाएँ',
    qtyMeters: 'मीटर',
    qtyPieces: 'मात्रा',
    subtotal: 'उप-योग',
    attachMeas: 'मेरा नाप जोड़ें',
    addToCart: 'कार्ट में डालें',
    chatWithShop: 'दुकान से चैट करें',
    payAtShop: 'डिलीवरी पर दुकान में भुगतान · Razorpay जल्द आ रहा है',
    cartTitle: 'आपका कार्ट',
    measAttached: 'नाप जुड़ा है',
    remove: 'हटाएँ',
    promoPh: 'प्रोमो कोड (ARLI10 आज़माएँ)',
    apply: 'लागू करें',
    discount: 'छूट',
    total: 'कुल',
    cartEmpty: 'आपका कार्ट खाली है।',
    startShopping: 'खरीदारी शुरू करें',
    checkoutProceed: 'चेकआउट करें',
    loginTitle: 'स्वागत है',
    loginSub: 'फ़ोन नंबर से लॉगिन करें या खाता बनाएँ।',
    phoneLabel: 'फ़ोन नंबर',
    sendOtp: 'OTP भेजें',
    or: 'या',
    googleBtn: 'Google से जारी रखें',
    devfrogsBtn: 'Devfrogs से जारी रखें',
    otpTitle: 'OTP डालें',
    otpSub: 'हमने 4-अंकों का कोड भेजा है',
    verify: 'सत्यापित करें',
    changeNumber: 'नंबर बदलें',
    online: 'ऑनलाइन',
    shareMeas: 'नाप भेजें',
    chatPh: 'संदेश लिखें…',
  }
};

export default function App() {
  // Load standard Google Fonts matching design aesthetics
  const [fontsLoaded] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold
  });

  const [screen, setScreen] = useState('home');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [query, setQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [priceMax, setPriceMax] = useState('0');
  const [cat, setCat] = useState('all');

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // User details
  const [loggedIn, setLoggedIn] = useState(false);
  const [points, setPoints] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Promocodes
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoOk, setPromoOk] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');

  // Fetch listings from backend Express server
  useEffect(() => {
    // Standard android emulator maps host machine to 10.0.2.2, iOS maps to localhost (127.0.0.1)
    fetch('http://localhost:5000/api/listings')
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch(() => {
        // Safe empty array fallback
        setListings([]);
      });
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A3B66" />
        <Text style={styles.loadingText}>ARLI is loading…</Text>
      </View>
    );
  }

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleNavigate = (target: string) => {
    setScreen(target);
    setSelectedId(null);
  };

  const handleSelectListing = (id: number) => {
    setSelectedId(id);
    setScreen('listingDetail');
  };

  const handleSearchCategory = (category: string) => {
    setCat(category);
    setScreen('explore');
  };

  const handleAddToCart = (qty: number, attachMeas: boolean) => {
    const selectedItem = listings.find((l) => l.id === selectedId);
    if (!selectedItem) return;

    const newItem: CartItem = {
      id: Math.random(),
      name: selectedItem.name[lang],
      shop: selectedItem.shop[lang],
      price: selectedItem.price,
      unit: selectedItem.cat === 'fabric' ? 'm' : ' pcs',
      qty,
      hasMeas: attachMeas,
      hasDesign: false,
      swatch: selectedItem.base,
      total: selectedItem.price * qty,
    };

    setCart((prev) => [...prev, newItem]);
    setScreen('cart');
  };

  const handleRemoveCartItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = () => {
    const ok = promo.trim().toUpperCase() === 'ARLI10';
    setPromoApplied(true);
    setPromoOk(ok);
    setPromoMsg(ok 
      ? (lang === 'hi' ? '10% छूट लागू!' : '10% discount applied!') 
      : (lang === 'hi' ? 'अमान्य कोड' : 'Invalid code')
    );
  };

  const currentT = T[lang];
  const activeListing = listings.find((l) => l.id === selectedId) || null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        t={currentT}
        langLabel={lang === 'en' ? 'हिं' : 'EN'}
        cartCount={cart.length}
        points={points}
        loggedIn={loggedIn}
        onNavigate={handleNavigate}
        onToggleLang={toggleLang}
      />

      <View style={styles.body}>
        {screen === 'home' && (
          <Home
            listings={listings}
            t={currentT}
            lang={lang}
            onNavigate={handleNavigate}
            onSelectListing={handleSelectListing}
            onSearchCategory={handleSearchCategory}
          />
        )}
        {screen === 'explore' && (
          <Explore
            listings={listings}
            query={query}
            pincode={pincode}
            priceMax={priceMax}
            cat={cat}
            t={currentT}
            lang={lang}
            onQueryChange={setQuery}
            onPincodeChange={setPincode}
            onPriceMaxChange={setPriceMax}
            onCatChange={setCat}
            onSelectListing={handleSelectListing}
          />
        )}
        {screen === 'listingDetail' && (
          <ListingDetail
            item={activeListing}
            t={currentT}
            lang={lang}
            onBack={() => setScreen('explore')}
            onAddToCart={handleAddToCart}
            onChatWithShop={() => handleNavigate('chat')}
          />
        )}
        {screen === 'cart' && (
          <Cart
            cartItems={cart}
            onRemoveItem={handleRemoveCartItem}
            t={currentT}
            onProceed={() => {
              if (loggedIn) {
                setCart([]);
                setPoints((prev) => prev + 10);
                setScreen('home');
                alert(lang === 'hi' ? 'ऑर्डर सफलतापूर्वक भेजा गया!' : 'Stitching Order Placed Successfully!');
              } else {
                setScreen('login');
              }
            }}
            promo={promo}
            promoApplied={promoApplied}
            promoMsg={promoMsg}
            promoOk={promoOk}
            onPromoChange={setPromo}
            onApplyPromo={handleApplyPromo}
            onStartShopping={() => setScreen('explore')}
          />
        )}
        {screen === 'login' && (
          <Login
            t={currentT}
            onLoginSuccess={() => {
              setLoggedIn(true);
              setScreen('home');
            }}
            lang={lang}
          />
        )}
        {screen === 'chat' && (
          <Chat
            t={currentT}
            lang={lang}
          />
        )}
      </View>

      <MobileBottomNav
        currentScreen={screen}
        cartCount={cart.length}
        loggedIn={loggedIn}
        onNavigate={handleNavigate}
        t={currentT}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.bgPrimary,
  },
  body: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
    color: '#2A3B66',
  },
});
