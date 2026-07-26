import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { CartItem } from '../types';
import { Theme } from '../theme';

interface CartProps {
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  t: any;
  onProceed: () => void;
  promo: string;
  promoApplied: boolean;
  promoMsg: string;
  promoOk: boolean;
  onPromoChange: (val: string) => void;
  onApplyPromo: () => void;
  onStartShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onRemoveItem,
  t,
  onProceed,
  promo,
  promoApplied,
  promoMsg,
  promoOk,
  onPromoChange,
  onApplyPromo,
  onStartShopping,
}) => {
  const hasCart = cartItems.length > 0;
  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmt = promoApplied && promoOk ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discountAmt;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
      <Text style={styles.header}>{t.cartTitle}</Text>

      {hasCart ? (
        <View>
          {/* Cart list items */}
          <View style={styles.list}>
            {cartItems.map((ci) => (
              <View key={ci.id} style={styles.itemCard}>
                <View style={[styles.swatch, { backgroundColor: ci.swatch }]} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{ci.name}</Text>
                  <Text style={styles.itemShop}>{ci.shop} · ₹{ci.price}{ci.unit} × {ci.qty}</Text>
                  {ci.hasMeas && <Text style={styles.itemBadge}>📏 {t.measAttached}</Text>}
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemPrice}>₹{ci.total}</Text>
                  <TouchableOpacity onPress={() => onRemoveItem(ci.id)} style={styles.removeBtn}>
                    <Text style={styles.removeText}>{t.remove}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing summary */}
          <View style={styles.summaryCard}>
            <View style={styles.promoRow}>
              <TextInput
                value={promo}
                onChangeText={onPromoChange}
                placeholder={t.promoPh}
                placeholderTextColor={Theme.textMuted}
                autoCapitalize="characters"
                style={styles.promoInput}
              />
              <TouchableOpacity onPress={onApplyPromo} style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>{t.apply}</Text>
              </TouchableOpacity>
            </View>

            {promoApplied && (
              <Text style={[styles.promoMsg, promoOk ? styles.msgOk : styles.msgErr]}>
                {promoMsg}
              </Text>
            )}

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{t.subtotal}</Text>
              <Text style={styles.priceVal}>₹{subtotal}</Text>
            </View>

            {promoApplied && promoOk && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>{t.discount} (ARLI10)</Text>
                <Text style={styles.discountVal}>−₹{discountAmt}</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t.total}</Text>
              <Text style={styles.totalVal}>₹{total}</Text>
            </View>

            <TouchableOpacity onPress={onProceed} style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>{t.checkoutProceed}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.cartEmpty}</Text>
          <TouchableOpacity onPress={onStartShopping} style={styles.shoppingBtn}>
            <Text style={styles.shoppingBtnText}>{t.startShopping}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.bgPrimary,
    flex: 1,
  },
  header: {
    fontFamily: Theme.fontSerif,
    fontSize: 28,
    color: Theme.textPrimary,
    marginBottom: 20,
  },
  list: {
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatch: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.textPrimary,
  },
  itemShop: {
    fontFamily: Theme.fontSans,
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 2,
  },
  itemBadge: {
    fontFamily: Theme.fontSansSemiBold,
    fontSize: 10,
    color: Theme.colorPrimary,
    marginTop: 4,
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 50,
  },
  itemPrice: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.colorPrimary,
  },
  removeBtn: {
    padding: 2,
  },
  removeText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 11,
    color: Theme.colorAccent,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 12,
    padding: 16,
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    fontFamily: Theme.fontSans,
    backgroundColor: '#FAF5EC',
  },
  applyBtn: {
    backgroundColor: Theme.textPrimary,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  applyBtnText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 12,
    color: '#FAF5EC',
  },
  promoMsg: {
    fontFamily: Theme.fontSansBold,
    fontSize: 11,
    marginBottom: 12,
  },
  msgOk: {
    color: Theme.colorSuccess,
  },
  msgErr: {
    color: Theme.colorAccent,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceLabel: {
    fontFamily: Theme.fontSans,
    fontSize: 13,
    color: Theme.textSecondary,
  },
  priceVal: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.textPrimary,
  },
  discountLabel: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.colorSuccess,
  },
  discountVal: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.colorSuccess,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Theme.borderColor,
    paddingVertical: 10,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: Theme.fontSansBold,
    fontSize: 16,
    color: Theme.textPrimary,
  },
  totalVal: {
    fontFamily: Theme.fontSansBold,
    fontSize: 16,
    color: Theme.colorPrimary,
  },
  checkoutBtn: {
    backgroundColor: Theme.colorAccent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 14,
    color: '#fff',
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Theme.fontSans,
    fontSize: 15,
    color: Theme.textMuted,
    marginBottom: 20,
  },
  shoppingBtn: {
    backgroundColor: Theme.colorPrimary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  shoppingBtnText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: '#FAF5EC',
  },
});
