# ⚡ Digital Electronics Virtual Lab (Mobile & PC)

एक आधुनिक, टच-ऑप्टिमाइज़्ड और फुल-फीचर्ड **डिजिटल इलेक्ट्रॉनिक्स वर्चुअल लैब** जिसे आप अपने **मोबाइल फोन** या कंप्यूटर से आसानी से चला सकते हैं।

---

## 📱 अपने मोबाइल फोन से कैसे चलाएं? (How to use on Phone)

1. **PC और Phone को सेम Wi-Fi से जोड़ें**:
   - आपका कंप्यूटर और मोबाइल फोन एक ही Wi-Fi नेटवर्क (या फोन के Hotspot) से कनेक्ट होने चाहिए।
2. **लैब सर्वर शुरू करें**:
   - टर्मिनल में `npm run dev` चलाएं या `start-lab.bat` पर डबल-क्लिक करें।
3. **फोन के ब्राउज़र में खोलें**:
   - अपने फोन के Chrome या Safari ब्राउज़र में यह लिंक डालें:
   ```text
   http://192.168.31.181:5173
   ```
4. **App की तरह इंस्टॉल करें (PWA / Full Screen)**:
   - **Chrome**: ऊपर तीन डॉट्स `⋮` पर टैप करें -> **"Add to Home screen"** / **"Install App"** दबाएं।
   - **Safari (iPhone)**: Share बटन -> **"Add to Home Screen"** दबाएं।

---

## 🔬 10 प्रैक्टिकल एक्सपेरिमेंट्स (Syllabus Lab Practicals)

ऐप में नीचे बॉटम बार पर **🧪 (Lab Experiments)** बटन पर टैप करके आप इनमें से किसी भी प्रैक्टिकल को 1-टैप में लोड करके तुरंत टेस्ट कर सकते हैं:

1. **Exp 1: Verification of basic logic gates (AND, OR, NAND, NOR, XOR, XNOR)**
   - 6 प्राथमिक और सार्वभौमिक गेट्स का एक साथ पैरेलल वेरिफिकेशन।
2. **Exp 2: Realization of OR, AND, NOR, XOR, XNOR using NAND and NOR gates**
   - केवल NAND गेट्स का उपयोग करके AND, OR, और 4-NAND गेट XOR परिपथ का निर्माण।
3. **Exp 3: Realization of SOP and POS expressions**
   - Sum of Products ($Y = AB + CD$) और Product of Sums ($Y = (A+B)(C+D)$) का कार्यान्वयन।
4. **Exp 4: Half Adder, Full Adder, Half Subtractor, Full Subtractor**
   - 1-बिट बाइनरी जोड़ और घटाव (Sum, Carry, Difference, Borrow)।
5. **Exp 5: 4-bit Ripple Adder and Subtractor**
   - Mode $M$ (0=ADD, 1=SUB) स्विच के साथ 4-बिट रिपल कैरी जोड़/घटाव, $C_{OUT}$ और Overflow ($V$) फ्लैग।
6. **Exp 6: 4:1 Multiplexer, 1:4 Demultiplexer, 8:1 MUX and 1:8 DEMUX**
   - 3 सेलेक्ट लाइन्स ($S_0, S_1, S_2$) द्वारा 8-चैनल डेटा रूटिंग और डिस्ट्रीब्यूशन।
7. **Exp 7: 2421 BCD to TIL-312 Seven Segment Display**
   - सेल्फ-कॉम्प्लिमेंटिंग 2421 एकेन कोड (Weights: 2, 4, 2, 1) का डेकोडिंग और ऑथेंटिक Texas Instruments TIL-312 7-सेगमेंट रेड LED डिस्प्ले।
8. **Exp 8: R-S, J-K and D Flip-Flops with and without clock**
   - अनक्लॉक्ड RS लैच बनाम क्लॉक्ड RS, टॉगल JK-FF और D-FF का तुलनात्मक अध्ययन।
9. **Exp 9: Divide by 2, 4, 8 Asynchronous Counter, 4-bit Binary Counter and Ring Counter**
   - फ्रीक्वेंसी डिवाइडर (CLK/2, CLK/4, CLK/8), 0-15 बाइनरी काउंटर और 4-बिट सर्कुलेटिंग रिंग काउंटर (1000->0100->0010->0001)।
10. **Exp 10: PIPO and SISO Registers using clock and MUX**
    - सीरियल-इन सीरियल-आउट (SISO) और पैरेलल-इन पैरेलल-आउट (PIPO) शिफ्ट रजिस्टर्स।

---

## 👆 मोबाइल टच जेस्चर (Touch Gestures)

- 🔌 **Tap-to-Connect Wire (मोबाइल के लिए सबसे आसान)**:
  - किसी भी कंपोनेंट की Output पिन पर टैप करें (pin glow होगी और yellow banner दिखेगा)।
  - जिस Input पिन से जोड़ना है उस पर टैप करें — Wire तुरंत जुड़ जाएगी!
- 🤏 **Pinch-to-Zoom**:
  - दो उंगलियों (2 fingers) से स्क्रीन पर पिंच करके ज़ूम-इन और ज़ूम-आउट करें।
- 🖐️ **Canvas Pan**:
  - बैकग्राउंड पर टच करके सर्किट को स्क्रीन पर इधर-उधर स्क्रॉल / पैन करें।
- 🔘 **1-Touch Toggle**:
  - Switches, Buttons और DIP Switches को एक टच से 0 (LOW) या 1 (HIGH) करें।
- 📳 **Haptic Vibration & Realistic Audio**:
  - वायर कनेक्ट होने, स्विच टॉगल होने और बजर बजने पर फोन में वाइब्रेशन और साउंड सुनाई देगा।
