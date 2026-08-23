import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
import { Checkout } from './src/pages/Checkout';
import { Login } from './src/pages/Login';
import { Profile } from './src/pages/Profile';
import { Chat } from './src/pages/Chat';
import { AIFeatures } from './src/pages/AIFeatures';
import type { Listing, CartItem } from '@arli/contracts';
import { getCustomerDictionary, toggleLang as flipLang, otherLangLabel, type Lang } from '@arli/i18n';
import { cartTotals, priceUnit, nearestListings, locatableCount } from '@arli/core';
import { ApiError } from '@arli/api-client';
import { useNearbyLocation } from './src/hooks/useNearbyLocation';
import { TryOn } from './src/pages/TryOn';
import { api } from './src/api';
import { theme as Theme } from '@arli/tokens';



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

  // Location permission + coordinates for "shops near me". Declared here,
  // before the fontsLoaded early return below, because it is a HOOK (it calls
  // useState internally) — a hook after a conditional return changes how many
  // hooks run between the loading render and the loaded one, which crashes
  // with "Rendered more hooks than during the previous render."
  const nearby = useNearbyLocation();

  const [screen, setScreen] = useState('home');
  const [lang, setLang] = useState<Lang>('en');
  const [query, setQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [priceMax, setPriceMax] = useState('0');
  const [cat, setCat] = useState('all');

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // User details
  const [loggedIn, setLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  // Bumped on every logout to force Login to remount with fresh internal
  // state. Without this, React reuses the same <Login> instance across
  // navigations, so its own phone/OTP/step state from a much earlier session
  // silently resurfaces — a logged-out user could land back on someone else's
  // half-completed OTP screen.
  const [loginKey, setLoginKey] = useState(0);
  const [points, setPoints] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Promocodes
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [listingsError, setListingsError] =
    useState<'serverUnreachable' | 'loadFailed' | null>(null);

  // Fetch listings from backend Express server
  useEffect(() => {
    api.listings
      .list()
      .then((data) => {
        setListings(data);
        setListingsError(null);
      })
      .catch((err: unknown) => {
        setListings([]);
        setListingsError(
          err instanceof ApiError && err.kind === 'network' ? 'serverUnreachable' : 'loadFailed',
        );
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
      id: `${Date.now()}-${selectedItem.id}`,
      listingId: selectedItem.id,
      name: selectedItem.name[lang],
      shop: selectedItem.shop[lang],
      price: selectedItem.price,
      unit: priceUnit(selectedItem),
      qty,
      hasMeas: attachMeas,
      hasDesign: false,
      swatch: selectedItem.base,
    };

    setCart((prev) => [...prev, newItem]);
    setScreen('cart');
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = () => setPromoApplied(true);

  const currentT = getCustomerDictionary(lang);


  // When we have a fix, rank by real distance; otherwise leave order untouched
  // so the catalogue never silently changes under the user.
  const nearbyListings = nearby.coords
    ? nearestListings(listings, nearby.coords).map((r) => r.listing)
    : null;
  const nearbyDistances = nearby.coords
    ? new Map(nearestListings(listings, nearby.coords).map((r) => [r.listing.id, r.distanceKm]))
    : null;

  // One promo calculation, shared with the cart — the same fix applied to the
  // web customer app.
  const totals = cartTotals(cart, promoApplied ? promo : '');
  const promoOk = totals.appliedCode !== null;
  const promoMsg = !promoApplied
    ? ''
    : promoOk
      ? lang === 'hi' ? '10% छूट लागू!' : '10% discount applied!'
      : lang === 'hi' ? 'अमान्य कोड' : 'Invalid code';
  const activeListing = listings.find((l) => l.id === selectedId) || null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        t={currentT}
        langLabel={otherLangLabel(lang)}
        cartCount={cart.length}
        points={points}
        loggedIn={loggedIn}
        onNavigate={handleNavigate}
        onToggleLang={() => setLang(flipLang)}
      />

      <View style={styles.body}>
        {listingsError && (
          <Text style={styles.errorBanner}>{currentT[listingsError]}</Text>
        )}
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
            listings={nearbyListings ?? listings}
            distances={nearbyDistances}
            locationStatus={nearby.status}
            locationErrorKey={nearby.errorKey}
            locatableCount={locatableCount(listings)}
            onUseMyLocation={nearby.request}
            onClearLocation={nearby.clear}
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
            onTryOn={() => setScreen('tryOn')}
          />
        )}
        {screen === 'cart' && (
          <Cart
            cartItems={cart}
            onRemoveItem={handleRemoveCartItem}
            t={currentT}
            onProceed={() => setScreen(loggedIn ? 'checkout' : 'login')}
            promo={promo}
            promoApplied={promoApplied}
            totals={totals}
            promoMsg={promoMsg}
            promoOk={promoOk}
            onPromoChange={setPromo}
            onApplyPromo={handleApplyPromo}
            onStartShopping={() => setScreen('explore')}
          />
        )}
        {screen === 'checkout' && (
          <Checkout
            cartItems={cart}
            totals={totals}
            t={currentT}
            onClearCart={() => {
              setCart([]);
              setPromo('');
              setPromoApplied(false);
            }}
            onNavigate={handleNavigate}
            onAddPoints={(p) => setPoints((prev) => prev + p)}
          />
        )}
        {screen === 'login' && (
          <Login
            key={loginKey}
            t={currentT}
            onLoginSuccess={(phone) => {
              setLoggedIn(true);
              setUserPhone(phone);
              setScreen('home');
            }}
            lang={lang}
          />
        )}
        {screen === 'profile' && (
          <Profile
            t={currentT}
            loggedIn={loggedIn}
            phone={userPhone}
            points={points}
            onLogout={() => {
              setLoggedIn(false);
              setUserPhone('');
              setLoginKey((k) => k + 1);
              setScreen('home');
            }}
            onNavigate={handleNavigate}
          />
        )}
        {screen === 'tryOn' && (
          <TryOn
            item={activeListing}
            t={currentT}
            lang={lang}
            onBack={() => setScreen('listingDetail')}
          />
        )}
        {screen === 'chat' && (
          <Chat
            t={currentT}
            lang={lang}
          />
        )}
        {screen === 'aiFeatures' && (
          <AIFeatures t={currentT} onBrowse={() => setScreen('explore')} />
        )}
      </View>

      {/* Hidden during checkout and try-on: both have their own bottom-pinned
          action bar (Place order / the camera shutter), and the floating nav
          — position: 'absolute', zIndex: 999 — sat on top of it, visually
          burying the actual button behind the ACCOUNT tab. */}
      {screen !== 'checkout' && screen !== 'tryOn' && (
        <MobileBottomNav
          currentScreen={screen}
          cartCount={cart.length}
          loggedIn={loggedIn}
          onNavigate={handleNavigate}
          t={currentT}
        />
      )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.bgPrimary,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: Theme.colorWarningBg,
    color: Theme.colorWarningText,
    fontSize: 13,
    fontFamily: Theme.fontSansSemiBold,
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
