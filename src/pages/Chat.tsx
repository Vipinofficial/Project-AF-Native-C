import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { Message } from '../types';
import { theme as Theme } from '@arli/tokens';

interface ChatProps {
  t: any;
  lang: 'en' | 'hi';
}

export const Chat: React.FC<ChatProps> = ({ t, lang }) => {
  const shopName = lang === 'hi' ? 'बनारस वस्त्र भंडार' : 'Varanasi Vastra Bhandar';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      align: 'flex-start',
      bg: '#fff',
      fg: Theme.textPrimary,
      text: lang === 'hi'
        ? `नमस्ते! मैं ${shopName} से बोल रहा हूँ। कुर्ता सिलाई के लिए क्या नाप रखना है?`
        : `Hello! I am speaking from ${shopName}. What measurements do you want for the kurta tailoring?`
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { align: 'flex-end', bg: Theme.colorPrimary, fg: '#FAF5EC', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        align: 'flex-start',
        bg: '#fff',
        fg: Theme.textPrimary,
        text: lang === 'hi' ? 'धन्यवाद! मुझे नाप मिल गया है।' : 'Thank you! I have updated your stitching card.'
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  const handleShareMeas = () => {
    const measMsg: Message = {
      align: 'flex-end',
      bg: '#EDF0F7',
      fg: Theme.colorPrimary,
      text: '📏 Shared saved body measurements: Chest 38", Waist 32", Hip 40", Shoulder 17"'
    };
    setMessages((prev) => [...prev, measMsg]);
  };

  return (
    <View style={styles.container}>
      {/* Target headers */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🏪</Text>
        </View>
        <View>
          <Text style={styles.shopName}>{shopName}</Text>
          <Text style={styles.status}>{t.online || 'Online'}</Text>
        </View>
      </View>

      {/* Message logs */}
      <ScrollView contentContainerStyle={styles.scroll} style={{ flex: 1 }}>
        {messages.map((msg, i) => {
          const isUser = msg.align === 'flex-end';
          return (
            <View
              key={i}
              style={[
                styles.bubble,
                isUser ? styles.bubbleUser : styles.bubbleShop,
                { backgroundColor: msg.bg }
              ]}
            >
              <Text style={[styles.bubbleText, { color: msg.fg }]}>{msg.text}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Inputs bar */}
      <View style={styles.inputArea}>
        <View style={styles.shortcuts}>
          <TouchableOpacity onPress={handleShareMeas} style={styles.shortcutBtn}>
            <Text style={styles.shortcutText}>📏 {t.shareMeas}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t.chatPh}
            placeholderTextColor={Theme.textMuted}
            style={styles.chatInput}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.bgPrimary,
    flex: 1,
  },
  headerRow: {
    backgroundColor: Theme.colorPrimary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.colorWarning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  shopName: {
    fontFamily: Theme.fontSansBold,
    fontSize: 14,
    color: '#FAF5EC',
  },
  status: {
    fontFamily: Theme.fontSans,
    fontSize: 11,
    color: 'rgba(250, 245, 236, 0.75)',
    marginTop: 2,
  },
  scroll: {
    padding: 16,
    gap: 10,
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 14,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 2,
  },
  bubbleShop: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: Theme.borderColor,
  },
  bubbleText: {
    fontFamily: Theme.fontSans,
    fontSize: 13.5,
    lineHeight: 18,
  },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: Theme.borderColor,
    padding: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  shortcuts: {
    flexDirection: 'row',
  },
  shortcutBtn: {
    backgroundColor: '#EDF0F7',
    borderWidth: 1,
    borderColor: '#C6CFE3',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  shortcutText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 11,
    color: Theme.colorPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 13.5,
    backgroundColor: '#FAF5EC',
  },
  sendBtn: {
    backgroundColor: Theme.colorAccent,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 14,
  },
});
