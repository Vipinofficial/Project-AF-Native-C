import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { Listing } from '@arli/contracts';
import { ListingCard } from '../components/ListingCard';
import { OfferCard } from '../components/OfferCard';
import { theme as Theme } from '@arli/tokens';

interface HomeProps {
  listings: Listing[];
  t: any;
  lang: 'en' | 'hi';
  onNavigate: (screen: string) => void;
  onSelectListing: (id: number) => void;
  onSearchCategory: (cat: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  listings,
  t,
  lang,
  onNavigate,
  onSelectListing,
  onSearchCategory,
}) => {
  const categories = [
    { id: 'all', label: t.catAll, color: '#2A3B66' },
    { id: 'fabric', label: t.catFabric, color: '#7A2E4D' },
    { id: 'garment', label: t.catGarment, color: '#4E6B4B' },
    { id: 'service', label: t.catService, color: '#39597B' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }}>
      {/* Hero Banner Banner */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={styles.offersBadge}>
            <Text style={styles.offersBadgeText}>{t.offersLabel}</Text>
          </View>
          <Text style={styles.heroTitle}>
            {t.heroTitle1 || 'Your neighbourhood'}{'\n'}{t.heroTitle2 || 'fashion bazaar.'}
          </Text>
          <TouchableOpacity onPress={() => onNavigate('explore')} style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>{t.startShopping} →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories chips horizontal strip */}
      <View style={styles.catSection}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((catItem) => (
            <TouchableOpacity
              key={catItem.id}
              onPress={() => onSearchCategory(catItem.id)}
              style={styles.catChip}
            >
              <View style={[styles.catCircle, { backgroundColor: catItem.color }]} />
              <Text style={styles.catLabel}>{catItem.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Offers details */}
      <View style={styles.offersSection}>
        <Text style={styles.sectionHeader}>{t.offersLabel}</Text>
        <OfferCard mark="% ARLI10" title={t.offer1} sub={t.offer1Sub} />
        <OfferCard mark="★ STAR" title={t.offer2} sub={t.offer2Sub} />
      </View>

      {/* Products list */}
      <View style={styles.listingsSection}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionHeaderSerif}>{t.featuredTitle}</Text>
          <TouchableOpacity onPress={() => onNavigate('explore')}>
            <Text style={styles.viewAllText}>{t.viewAll} →</Text>
          </TouchableOpacity>
        </View>

        {listings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t.noListings}</Text>
          </View>
        ) : (
          listings.slice(0, 4).map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              lang={lang}
              t={t}
              onClick={() => onSelectListing(item.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.bgPrimary,
    flex: 1,
  },
  hero: {
    height: 220,
    backgroundColor: '#22201C',
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(42, 59, 102, 0.45)',
  },
  heroContent: {
    zIndex: 2,
  },
  offersBadge: {
    backgroundColor: Theme.colorWarning,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  offersBadgeText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 9,
    textTransform: 'uppercase',
    color: Theme.textPrimary,
  },
  heroTitle: {
    fontFamily: Theme.fontSerif,
    fontSize: 28,
    color: '#FAF5EC',
    lineHeight: 32,
    marginBottom: 12,
  },
  heroBtn: {
    backgroundColor: Theme.colorAccent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 12,
    color: '#fff',
  },
  catSection: {
    backgroundColor: Theme.bgSecondary,
    paddingVertical: 16,
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  catChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  catLabel: {
    fontFamily: Theme.fontSansBold,
    fontSize: 12,
    color: Theme.textPrimary,
  },
  offersSection: {
    backgroundColor: Theme.colorPrimary,
    padding: 16,
  },
  sectionHeader: {
    fontFamily: Theme.fontSansBold,
    fontSize: 11,
    textTransform: 'uppercase',
    color: Theme.colorWarning,
    letterSpacing: 1,
    marginBottom: 10,
  },
  listingsSection: {
    padding: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderSerif: {
    fontFamily: Theme.fontSerif,
    fontSize: 24,
    color: Theme.textPrimary,
  },
  viewAllText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 12,
    color: Theme.colorAccent,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Theme.fontSans,
    color: Theme.textMuted,
    fontSize: 13,
  },
});
