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
import type { Listing, CartItem } from '@arli/contracts';
import { getCustomerDictionary, toggleLang as flipLang, otherLangLabel, type Lang } from '@arli/i18n';
import { cartTotals, priceUnit } from '@arli/core';
import { ApiError } from '@arli/api-client';
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
            totals={totals}
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
