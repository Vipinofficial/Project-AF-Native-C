import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { Theme } from '../theme';

interface ExploreProps {
  listings: Listing[];
  query: string;
  pincode: string;
  priceMax: string;
  cat: string;
  t: any;
  lang: 'en' | 'hi';
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
        <Text style={styles.resultsText}>
          {filtered.length} {t.resultsFound}
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t.noResults}</Text>
          </View>
        ) : (
          filtered.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              lang={lang}
              t={t}
              onClick={() => onSelectListing(item.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
