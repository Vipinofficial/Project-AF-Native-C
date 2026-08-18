import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { Listing } from '@arli/contracts';
import { formatDistance } from '@arli/core';
import type { CustomerDictionary } from '@arli/i18n';
import { ListingCard } from '../components/ListingCard';
import { theme as Theme } from '@arli/tokens';
import type { LocationStatus } from '../hooks/useNearbyLocation';

interface ExploreProps {
  listings: Listing[];
  query: string;
  pincode: string;
  priceMax: string;
  cat: string;
  t: CustomerDictionary;
  lang: 'en' | 'hi';
  /** Distance in km per listing id, when a location fix is available. */
  distances: Map<number, number> | null;
  locationStatus: LocationStatus;
  locationErrorKey: 'locDenied' | 'locBlocked' | 'locUnavailable' | null;
  /** How many listings could be placed on a map at all. */
  locatableCount: number;
  onUseMyLocation: () => void;
  onClearLocation: () => void;
  onQueryChange: (val: string) => void;
  onPincodeChange: (val: string) => void;
  onPriceMaxChange: (val: string) => void;
  onCatChange: (val: string) => void;
  onSelectListing: (id: number) => void;
}

export const Explore: React.FC<ExploreProps> = ({
  listings,
  query,
  pincode,
  priceMax,
  cat,
  t,
  lang,
  onQueryChange,
  onPincodeChange,
  onPriceMaxChange,
  onCatChange,
  onSelectListing,
  distances,
  locationStatus,
  locationErrorKey,
  locatableCount,
  onUseMyLocation,
  onClearLocation,
}) => {
  const catChips = [
    { id: 'all', label: t.catAll },
    { id: 'fabric', label: t.catFabric },
    { id: 'garment', label: t.catGarment },
    { id: 'service', label: t.catService },
  ];

  const filtered = listings.filter((item) => {
    if (cat !== 'all' && item.cat !== cat) return false;
    
    const maxVal = Number(priceMax);
    if (maxVal > 0 && item.price > maxVal) return false;

    if (pincode.trim() && !item.pincode.startsWith(pincode.trim())) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const matchName = item.name[lang].toLowerCase().includes(q);
      const matchShop = item.shop[lang].toLowerCase().includes(q);
      const matchDesc = item.desc[lang].toLowerCase().includes(q);
      if (!matchName && !matchShop && !matchDesc) return false;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterBox}>
        {/* Search input styled in Instrument Serif */}
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={t.searchPh}
          placeholderTextColor={Theme.textMuted}
          style={styles.searchInput}
        />

        <View style={styles.row}>
          <TextInput
            value={pincode}
            onChangeText={onPincodeChange}
            placeholder={t.pincodePh}
            placeholderTextColor={Theme.textMuted}
            keyboardType="numeric"
            style={styles.halfInput}
          />

          <TouchableOpacity
            style={styles.priceSelect}
            onPress={() => {
              const nextPrice = priceMax === '0' ? '500' : priceMax === '500' ? '1000' : priceMax === '1000' ? '2000' : '0';
              onPriceMaxChange(nextPrice);
            }}
          >
            <Text style={styles.priceSelectText}>
              {priceMax === '0' ? t.anyPrice : `${t.under} ₹${priceMax}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category selection chips */}
      <View style={styles.chipRow}>
        {catChips.map((chip) => {
          const isSelected = cat === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              onPress={() => onCatChange(chip.id)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Shops near me. Only offered when at least one shop can actually be
            located, so the button never leads to an empty list. */}
        {locationStatus === 'granted' ? (
          <TouchableOpacity style={styles.nearActive} onPress={onClearLocation}>
            <Text style={styles.nearActiveText}>📍 {t.sortNearest}  ✕</Text>
          </TouchableOpacity>
        ) : locatableCount > 0 ? (
          <TouchableOpacity
            style={styles.nearBtn}
            onPress={onUseMyLocation}
            disabled={locationStatus === 'requesting'}
          >
            <Text style={styles.nearBtnText}>
              {locationStatus === 'requesting' ? t.locating : `📍 ${t.useMyLocation}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noticeText}>{t.noLocatableShops}</Text>
        )}

        {locationErrorKey && (
          <Text style={styles.errorText}>{t[locationErrorKey]}</Text>
        )}

        <Text style={styles.resultsText}>
          {filtered.length} {t.resultsFound}
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t.noResults}</Text>
          </View>
        ) : (
          filtered.map((item) => (
            <View key={item.id}>
              <ListingCard
                item={item}
                lang={lang}
                t={t}
                onClick={() => onSelectListing(item.id)}
              />
              {distances?.has(item.id) && (
                <Text style={styles.distanceText}>
                  📍 {formatDistance(distances.get(item.id)!)} {t.awayFromYou}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  nearBtn: {
    borderWidth: 1.5, borderColor: Theme.borderColor, borderRadius: 999,
    paddingVertical: 12, alignItems: 'center', marginBottom: 12,
    backgroundColor: Theme.colorCardBg, minHeight: 48, justifyContent: 'center',
  },
  nearBtnText: { fontSize: 14, fontFamily: Theme.fontSansBold, color: Theme.colorPrimary },
  nearActive: {
    borderRadius: 999, paddingVertical: 12, alignItems: 'center', marginBottom: 12,
    backgroundColor: Theme.colorPrimary, minHeight: 48, justifyContent: 'center',
  },
  nearActiveText: { fontSize: 14, fontFamily: Theme.fontSansBold, color: Theme.colorCream },
  noticeText: { fontSize: 12.5, color: Theme.textMuted, marginBottom: 12, textAlign: 'center' },
  errorText: {
    fontSize: 12.5, color: Theme.colorWarningText, backgroundColor: Theme.colorWarningBg,
    padding: 10, borderRadius: 10, marginBottom: 12, lineHeight: 18,
  },
  distanceText: {
    fontSize: 11.5, color: Theme.textMuted, fontFamily: Theme.fontSansSemiBold,
    marginTop: -6, marginBottom: 10, marginLeft: 4,
  },
  container: {
    backgroundColor: Theme.bgPrimary,
    flex: 1,
  },
  filterBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderColor,
    gap: 10,
  },
  searchInput: {
    fontFamily: Theme.fontSerifItalic,
    fontSize: 18,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F5EFE1',
    color: Theme.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
    fontFamily: Theme.fontSans,
    fontSize: 13,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  priceSelect: {
    flex: 1.5,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  priceSelectText: {
    fontFamily: Theme.fontSansMedium,
    fontSize: 13,
    color: Theme.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipSelected: {
    backgroundColor: Theme.colorPrimary,
    borderColor: Theme.colorPrimary,
  },
  chipText: {
    fontFamily: Theme.fontSansSemiBold,
    fontSize: 12,
    color: Theme.textPrimary,
  },
  chipTextSelected: {
    color: '#FAF5EC',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  resultsText: {
    fontFamily: Theme.fontSans,
    fontSize: 11,
    color: Theme.textMuted,
    marginBottom: 12,
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Theme.fontSans,
    fontSize: 14,
    color: Theme.textMuted,
    textAlign: 'center',
  },
});
