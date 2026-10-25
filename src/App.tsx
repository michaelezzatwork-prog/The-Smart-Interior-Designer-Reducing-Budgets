import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Layers, 
  Map, 
  Move, 
  ShoppingBag, 
  Eye, 
  Check, 
  AlertCircle, 
  Info, 
  X, 
  Maximize2, 
  ChevronRight, 
  Palette, 
  Coins, 
  Lightbulb, 
  Compass, 
  Grid, 
  Plus, 
  Minimize, 
  Download,
  ExternalLink,
  Sliders,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';

// Types matching the server side schema
interface FurnitureItem {
  item: string;
  confidence: string;
  currentPosition: string;
  recommendation: string;
}

interface AestheticAnalysis {
  currentStyle: string;
  lightingRating: string;
  colorPalette: string[];
  recommendedPalette: string[];
}

interface RemodelingConcept {
  title: string;
  description: string;
  wallsRecommendation: string;
  flooringRecommendation: string;
  lightingRecommendation: string;
}

interface BudgetItem {
  category: string;
  item: string;
  estimatedPrice: number;
  priority: string;
  notes: string;
}

interface ShoppingSuggestion {
  name: string;
  store: string;
  estimatedPrice: number;
  description: string;
  url: string;
}

interface LayoutElement {
  furnitureType: string;
  label: string;
  xPercent: number;
  yPercent: number;
  rearrangementText: string;
}

interface AnalysisData {
  furnitureDetected: FurnitureItem[];
  strengths: string[];
  weaknesses: string[];
  aestheticAnalysis: AestheticAnalysis;
  remodelingConcept: RemodelingConcept;
  budgetBreakdown: BudgetItem[];
  shoppingSuggestions: ShoppingSuggestion[];
  layoutPlan2D: LayoutElement[];
}

// Quick Sample Presets (Bilingual Egyptian presets to showcase the features instantly)
const SAMPLE_PRESETS = [
  {
    id: 'preset-living',
    nameAr: 'غرفة معيشة مودرن',
    nameEn: 'Modern Living Room',
    roomType: 'living',
    style: 'modern',
    budget: 65000,
    currency: 'EGP',
    originalUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    redesignUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    analysis: {
      furnitureDetected: [
        { item: 'سفرة خشبية قديمة / Old Dining Table', confidence: 'High', currentPosition: 'وسط الغرفة مما يعيق حركة المرور', recommendation: 'يفضل استبدالها بطاولة قهوة منخفضة بيضاوية لتوسيع الممرات الحركية.' },
        { item: 'كنبة رمادية مستهلكة / Main Sofa', confidence: 'High', currentPosition: 'مقابلة للحائط المظلم تماماً', recommendation: 'إعادة توجيهها لتواجه مصدر الضوء الطبيعي بزاوية 45 درجة.' },
        { item: 'وحدة تخزين أفقية / Horizontal cabinet', confidence: 'Medium', currentPosition: 'بجوار باب الشرفة تمنع فتحه بالكامل', recommendation: 'نقلها للجدار الخلفي لتدعيم الارتفاع البصري للغرفة.' }
      ],
      strengths: [
        'إضاءة نهارية ممتازة قادمة من الشرفة العريضة.',
        'ارتفاع سقف مريح يسمح بوحدات إضاءة متدلية.',
        'جدران مستوية خالية من الرطوبة البنائية.'
      ],
      weaknesses: [
        'تكدس قطع الأثاث الكبيرة يعيق التدفق الهوائي والمسارات.',
        'درجة طلاء باهتة تميل للاصفرار تفقد الإضاءة بريقها.',
        'عدم وجود توزيع كافٍ لمقابس الكهرباء مما ينشئ مظهراً غير مرتب للأسلاك.'
      ],
      aestheticAnalysis: {
        currentStyle: 'عشوائي تقليدي مائل للازدحام (Eclectic Cluttered)',
        lightingRating: '7/10 (إضاءة طبيعية جيدة جداً، مع غياب التوزيع المسائي)',
        colorPalette: ['#EAE5D9', '#C3B091', '#4A3B32', '#F7F5F0'],
        recommendedPalette: ['#F3EFE9', '#D2C4B7', '#4E5340', '#1C1C1C']
      },
      remodelingConcept: {
        title: 'بساطة الاسكندنافي العصري - Cozy Natural Modernism',
        description: 'إعادة هيكلة فراغ المعيشة عبر تطبيق نظرية البساطة الاسكندنافية الصديقة للبيئة. التركيز هنا على تعظيم اتساع الفراغ بطلاء أبيض مطاط دافئ مائل للترابي الخفيف، مع إدخال عناصر خشب الزان الفاتح وأقمشة الكتان الطبيعية لتنعيم الارتدادات الصوتية والبصرية للغرفة وبعث شعور فندقي.',
        wallsRecommendation: 'طلاء الجدار الرئيسي بلون "البيج الفاتح الهادي" (ألوان الكتان) وبقية الجدران باللون الأبيض الحليبي المطفي لشرائح واسعة ومريحة.',
        flooringRecommendation: 'فرش سجادة مسطحة من طراز الجوت الطبيعي بتصميم أسمنتي أو خيوط كتان سميكة لربط زوايا الغرفة بصرياً.',
        lightingRecommendation: 'توزيع شريط إضاءة مخفية (LED Warm Warm) خلف الكنبة الرئيسية لإنشاء خلفية هادئة مريحة للعين مساءً.'
      },
      budgetBreakdown: [
        { category: 'دهانات الجدران / Paint', item: 'دهان جوتن فينوماستيك مطفي ناصع + التحضير', estimatedPrice: 7500, priority: 'High', notes: 'الأساس الجوهري لتغيير انعكاس الضوء الكلي باللمسة العصرية.' },
        { category: 'التأثيث والفرش / Furniture', item: 'كنبة مودرن ثلاثية من الكتان المقاوم للبقع', estimatedPrice: 28000, priority: 'High', notes: 'القطعة المركزية التي ستحدد هوية الفراغ الجديد وتضمن الراحة.' },
        { category: 'الإضاءة / Lighting', item: 'أبليكات معلقة وأشرطة ليد دافئة + كشافات زوايا', estimatedPrice: 11000, priority: 'Medium', notes: 'يخلق توازناً درامياً ومريحاً للأعصاب أثناء فترات الليل.' },
        { category: 'الديكور والزرع / Decor & Rug', item: 'سجادة تفتنج هيد بروبرتي + نباتات الظل الكبيرة مونستيرا', estimatedPrice: 12500, priority: 'Medium', notes: 'إضافة الملمس العضوي واللون الأخضر ينبض بالحياة الطبيعية.' },
        { category: 'المصنعية / Labor', item: 'أعمال الكهربائي والمحارة والتركيب', estimatedPrice: 6000, priority: 'Low', notes: 'تكاليف إشراف وتثبيت الوحدات المختلفة.' }
      ],
      shoppingSuggestions: [
        { name: 'كنبة قماش كتان ناعم 3 مقاعد', store: 'هومزمارت / Homzmart', estimatedPrice: 24500, description: 'تصميم اسكندنافي عصري مع وسائد عميقة لمكافحة الإرهاق.', url: 'https://homzmart.com' },
        { name: 'مصباح أرضي أسود مقوس ذكي', store: 'ايكيا / IKEA', estimatedPrice: 4800, description: 'يوفر إضاءة قراءة مركزة مع نشر هالة دافئة على الحائط المقابل.', url: 'https://www.ikea.com' },
        { name: 'سجادة دائرية جوت صناعة يدوية', store: 'صناع محليون بنقادة / Local Artisans', estimatedPrice: 3200, description: 'سجادة منسوجة يدوية بالكامل تدعم الاقتصاد الحرفي وتوفر طابعاً دافئاً أصيلاً.', url: '#' },
        { name: 'كرسي بذراعين قماش تيدي دافئ', store: 'هب فرنيتشر / Hub Furniture', estimatedPrice: 9500, description: 'تصميم منحني رائع لوضعه بزاوية مائلة يكمل فخامة طراز المعيشة.', url: '#' }
      ],
      layoutPlan2D: [
        { furnitureType: 'couch', label: 'الكنبة الرئيسية الكتان', xPercent: 50, yPercent: 30, rearrangementText: 'توضع بالمنتصف بالضبط للمحافظة على محاذاة الباب والشرفة ثنائياً.' },
        { furnitureType: 'table', label: 'طاولة بيضاوية من زان', xPercent: 50, yPercent: 62, rearrangementText: 'أمام الكنبة بمسافة 50 سم للسماح بمرور الأرجل بمرونة.' },
        { furnitureType: 'chair', label: 'كرسي تيدي الدائري', xPercent: 22, yPercent: 55, rearrangementText: 'يوضع بشكل مائل بزاوية ترحيبية بالدخول من ممر الغرفة الأساسي.' },
        { furnitureType: 'plant', label: 'نبات المونستيرا الكبيرة', xPercent: 80, yPercent: 25, rearrangementText: 'بجوار نافذة الشرفة لتلقي الضوء الطبيعي وتزيين الزاوية بصرياً.' },
        { furnitureType: 'lamp', label: 'المصباح المقوس المنحني', xPercent: 16, yPercent: 20, rearrangementText: 'خلف كرسي تيدي ليوفر إضاءة هادئة غير مباشرة.' },
        { furnitureType: 'window', label: 'نافذة الشرفة الكبرى', xPercent: 88, yPercent: 50, rearrangementText: 'مصدر التدفق الطبيعي البصري والهوائي الأساسي للغرفة.' }
      ]
    }
  },
  {
    id: 'preset-bedroom',
    nameAr: 'غرفة نوم مينيماليست',
    nameEn: 'Minimalist Bedroom',
    roomType: 'bedroom',
    style: 'minimalist',
    budget: 45000,
    currency: 'EGP',
    originalUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    redesignUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
    analysis: {
      furnitureDetected: [
        { item: 'سرير بنهايات حديدية مشغولة / Bed', confidence: 'High', currentPosition: 'مقابل مكيف الهواء مباشرة معوق للغاية', recommendation: 'استبدال السرير بهيكل خشبي منخفض مدمج مع السحارات السفلية للتخزين الهادئ.' },
        { item: 'كومودينو خشبي ثقيل وضخم / Side table', confidence: 'Medium', currentPosition: 'يزحم الممر الجانبي المتاخم للدولاب', recommendation: 'استخدام رفوف جدارية طائرة بدلاً منه لتعزيز اتساع مساحة الأرضية.' }
      ],
      strengths: [
        'أبعاد الغرفة المربعة الممتازة تتيح مرونة هائلة بالترتيب.',
        'وجود جدار مصمت تماماً ومثالي لتدعيم خلفية السرير.'
      ],
      weaknesses: [
        'تكدس الأدراج والأغراض البصرية يسبب قلقاً بصرياً يمنع النوم المريح.',
        'الإضاءة السقفية حادة وقوية جداً وموجهة لمركز السرير.'
      ],
      aestheticAnalysis: {
        currentStyle: 'كلاسيكي تقليدي داكن (Chunky Traditional)',
        lightingRating: '5/10 (إضاءة هجومية ساطعة بلا تفويج أو تباين)',
        colorPalette: ['#A0937D', '#826F66', '#3D3D3D', '#E9E5D9'],
        recommendedPalette: ['#FFFFFF', '#F5F5F5', '#8E8E8E', '#222222']
      },
      remodelingConcept: {
        title: 'سكينة الطراز المينيماليست الدافئ - Warm Zen Sanctuary',
        description: 'إلغاء الضوضاء البصرية والتركيز على فلسفة التقليل للحصول على فراغ نوم يبعث السكينة. نعتمد على بنية السرير المنخفض (البلاتفورم) بلون البلوط الفاتح، والطلاء الأبيض النقي الخالص، والمفروشات خالية من منقوشات الزهور الزائدة.',
        wallsRecommendation: 'طلاء كافة الجدران بلون "أبيض ممتص للوهج" مطفي هادئ، مع استبعاد أي ورق حائط صاخب.',
        flooringRecommendation: 'باركيه بلون بلوط شاحب أو فينيل إسمنتي مطفي خشن لضمان سلامة الخطوات.',
        lightingRecommendation: 'مصباحين طائرين على جانبي السرير مجهزين بإضاءة صفراء خافتة ذكية لتهيئة النوم المريح.'
      },
      budgetBreakdown: [
        { category: 'طلاءات وصيانة / Painting', item: 'تنظيف الجدران وتطبيق دهان سايبس هاف لاستر وايت', estimatedPrice: 4500, priority: 'High', notes: 'يضمن تفتيت انعكاس الإضاءات الحادة للحصول على تباين دافئ.' },
        { category: 'سرير وأخشاب / Bed frame', item: 'هيكل سرير منخفض ياباني بلوط زان 160 سم', estimatedPrice: 19500, priority: 'High', notes: 'إعادة تنظيم الارتفاع البصري وجعل الارتفاع أقل لرحابة ممتازة.' },
        { category: 'التخزين المخفي / Storage', item: 'خزانة مدمجة بجدار منزلق أبيض غير لامع', estimatedPrice: 13000, priority: 'Medium', notes: 'تخفي كافة الملابس والكركبة اليومية عن مرمى النظر التلقائي.' },
        { category: 'إضاءة وديكور / Smart lamps', item: 'مصباحين معلقين للجانبين وباقات نسيج بيضاء', estimatedPrice: 8000, priority: 'Medium', notes: 'خلق جو فندقي مريح يسّهل النوم والاسترخاء الهادئ.' }
      ],
      shoppingSuggestions: [
        { name: 'هيكل سرير منخفض بلوط ذكي', store: 'ايكيا / IKEA', estimatedPrice: 16800, description: 'سرير ذو تصميم مسطح ياباني يضفي روح الهدوء العضوي.', url: 'https://www.ikea.com' },
        { name: 'مصباح منسوج من خيوط الروطان الطبيعية', store: 'هومزمارت / Homzmart', estimatedPrice: 3500, description: 'ديكور معلق ينثر سحر ظلال الغابات العضوية على الجدران.', url: 'https://homzmart.com' },
        { name: 'طقم لحاف نوم أبيض قطن مصري 100%', store: 'لوكال تيكستايلز / Local Artisans', estimatedPrice: 4200, description: 'نعومة فاخرة وتهوية ممتازة تضمن راحة النوم العميق.', url: '#' }
      ],
      layoutPlan2D: [
        { furnitureType: 'bed', label: 'السرير الياباني المنخفض', xPercent: 50, yPercent: 40, rearrangementText: 'يستند للجدار المصمت بالمنتصف لضمان الأمان والتدفق الجانبي.' },
        { furnitureType: 'closet', label: 'الدولاب المدمج المنزلق', xPercent: 12, yPercent: 45, rearrangementText: 'موازٍ للسرير بآلية أبواب منزلقة لا تستهلك أي فراغ حركي.' },
        { furnitureType: 'chair', label: 'كرسي تأمل قماشي منخفض', xPercent: 82, yPercent: 75, rearrangementText: 'زاوية مخصصة للاسترخاء الفردي أو القراءة قبل النوم مباشرة.' },
        { furnitureType: 'lamp', label: 'مصباح جانبي معلق', xPercent: 32, yPercent: 20, rearrangementText: 'على يمين السرير كروي الشكل لإشاعة وهج ناعم مريح.' },
        { furnitureType: 'plant', label: 'نبات ثعبان ممتص للسموم', xPercent: 85, yPercent: 18, rearrangementText: 'في الزاوية لتجديد هواء الغرفة ونشر لمحة طبيعية لطيفة.' }
      ]
    }
  }
];

export default function App() {
  // Input UI State
  const [roomType, setRoomType] = useState<string>('living');
  const [style, setStyle] = useState<string>('modern');
  const [budget, setBudget] = useState<number>(50000);
  const [currency, setCurrency] = useState<string>('EGP');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compare' | 'layout' | 'budget' | 'shopping' | 'ar'>('compare');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // Camera & Trigger State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // App Flow / API Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Results State
  const [isRedesigned, setIsRedesigned] = useState<boolean>(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [redesignedImageUrl, setRedesignedImageUrl] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // Interactive Before & After Slider State
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  // 2D Spatial Planner State
  const [selectedLayoutElement, setSelectedLayoutElement] = useState<LayoutElement | null>(null);
  const [customLayoutElements, setCustomLayoutElements] = useState<LayoutElement[]>([]);
  const [draggingElementIndex, setDraggingElementIndex] = useState<number | null>(null);

  // Touch AR State
  const [arItems, setArItems] = useState([
    { id: 1, type: 'chair', label: 'Modern Accent Chair', x: 250, y: 350, r: 0, s: 1.0, src: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&q=80' },
    { id: 2, type: 'plant', label: 'Bonsai Ceramic Pot', x: 450, y: 400, r: 15, s: 0.8, src: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80' },
    { id: 3, type: 'lamp', label: 'Minimalist Tube Light', x: 600, y: 250, r: -10, s: 1.1, src: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80' }
  ]);
  const [selectedArItemId, setSelectedArItemId] = useState<number | null>(null);
  const [arDragState, setArDragState] = useState<{ isDragging: boolean; startX: number; startY: number; itemIndex: number } | null>(null);

  // Bilingual translation map for main tags
  const stylesInfo = [
    { id: 'modern', nameAr: 'مودرن عصرية', nameEn: 'Modern Aesthetic', descAr: 'خطوط هندسية نظيفة، مظهر عملي ممتاز وألوان متباينة هادئة.', descEn: 'Sleek geometries, optimal utility, neutral backgrounds with stark accents.' },
    { id: 'classic', nameAr: 'كلاسيك فرنسي', nameEn: 'Classic French', descAr: 'أخشاب مزخرفة فخمة، تفاصيل دقيقة وتناظر فني متوازن.', descEn: 'Ornate woodwork, deep plush fabrics, balanced symmetrical arrangements.' },
    { id: 'luxury', nameAr: 'فاخر مذهب', nameEn: 'Luxury Premium', descAr: 'إكسسوارات ذهبية ورخام ناصع مع إضاءة خافتة مثيرة.', descEn: 'Gilded fixtures, rich marble veining, and immersive atmospheric mood lighting.' },
    { id: 'minimalist', nameAr: 'مينيماليست هادئ', nameEn: 'Warm Minimalist', descAr: 'أقل قدر من الأثاث والفرش، تنفس فراغي كامل وسكينة زِن.', descEn: 'Absolute optimization, decluttered fields, light timber, zen-like tranquility.' },
    { id: 'scandinavian', nameAr: 'اسكندنافي مريح', nameEn: 'Scandinavian Cozy', descAr: 'خامات طبيعية (زان وجوت)، نباتات منزلية وأجواء مريحة هومية.', descEn: 'Natural light maximization, organic woodcraft, and cozy woolen tactile textures.' },
    { id: 'industrial', nameAr: 'صناعي جريء', nameEn: 'Industrial Loft', descAr: 'طوب مكشوف ميتاليك وأنابيب بارزة مع لمسة حديد أسود مطفي.', descEn: 'Exposed brick, concrete wash, metallic frames, reclaimed rustic timbers.' }
  ];

  // Camera capture workflow
  const startCamera = async () => {
    try {
      setApiError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access failed", err);
      setApiError("عذراً، لم نتمكن من الوصول لكاميرا الهاتف. يرجى رفع صورة يدوياً.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUploadedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setApiError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag-and-drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setApiError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to load sample presets easily
  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setIsLoading(true);
      setRoomType(preset.roomType);
      setStyle(preset.style);
      setBudget(preset.budget);
      setCurrency(preset.currency);
      setUploadedImage(preset.originalUrl);
      setOriginalImageUrl(preset.originalUrl);
      setRedesignedImageUrl(preset.redesignUrl);
      
      const steps = [
        'جاري فحص زوايا الغرفة وتحليل مصادر الضوء الطبيعية...',
        'تحديد مفردات الأثاث الحالية وقياس الحجم الكلي للفراغ...',
        'تطبيق خوارزميات الطراز المطلوب وإعادة تخيل الديكور الرقمي...',
        'محاذاة ترشيحات الشراء المحلية مع الميزانية المحددة وتوليد مخطط 2D...'
      ];

      let stepIdx = 0;
      setLoadingStep(steps[0]);
      
      const interval = setInterval(() => {
        stepIdx++;
        if (stepIdx < steps.length) {
          setLoadingStep(steps[stepIdx]);
        } else {
          clearInterval(interval);
          setAnalysisData(preset.analysis);
          setCustomLayoutElements(preset.analysis.layoutPlan2D);
          setIsLoading(false);
          setIsRedesigned(true);
          setApiError(null);
          setActiveTab('compare');
        }
      }, 950);
    }
  };

  // Main Call: Analyze and Refactor Room
  const handleGenerateDesign = async () => {
    if (!uploadedImage) {
      setApiError('يرجى اختيار صورة أولاً أو التقاطها بالكاميرا أو الضغط على أحد النماذج الجاهزة.');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setLoadingStep('تحميل الصورة وفحص الفراغ البصري...');

    const steps = [
      'جاري استدعاء الذكاء الاصطناعي لفحص الهيكل البنائي والكهربائي...',
      'رصد أبعاد الأثاث الحالي وتقدير مستويات الإضاءة والنوافذ...',
      'توليد التصميمات ثلاثية الأبعاد المتطابقة مع ميزانيتك المقترحة...',
      'العثور على الإكسسوارات الفنية وأماكن الشراء المناسبة بمصر والمنطقة...'
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setLoadingStep(steps[currentStepIndex]);
        currentStepIndex++;
      }
    }, 1200);

    try {
      // 1. Analyze Room
      const analyzeRes = await fetch('/api/analyze-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          style,
          budget,
          currency,
          roomType
        })
      });

      if (!analyzeRes.ok) {
        throw new Error('فشل الموديل في تحليل زوايا الغرفة. قد تكون الصورة غير واضحة.');
      }

      const analysisRaw: AnalysisData = await analyzeRes.json();
      setAnalysisData(analysisRaw);
      setCustomLayoutElements(analysisRaw.layoutPlan2D);

      setLoadingStep('جاري توليد الصورة الفوتوغرافية للتصميم الجديد (قد يستغرق هذا دقيقة)...');

      // 2. Generate Redesigned Render
      const generateRes = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          style,
          roomType
        })
      });

      if (!generateRes.ok) {
        throw new Error('فشل توليد التصميم الجديد. سنعرض التحليل والمخطط التفصيلي مع صورة تقريبية.');
      }

      const generateData = await generateRes.json();
      
      clearInterval(interval);
      setOriginalImageUrl(uploadedImage);
      setRedesignedImageUrl(generateData.imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80');
      setIsRedesigned(true);
      setIsLoading(false);
      setActiveTab('compare');
    } catch (err: any) {
      clearInterval(interval);
      console.error("Design execution failure", err);
      setApiError(err.message || 'حدث خطأ غير متوقع أثناء الاتصال بخوادم التصميم. يرجى المحاولة لاحقاً.');
      setIsLoading(false);
    }
  };

  // Reset function
  const handleReset = () => {
    setIsRedesigned(false);
    setAnalysisData(null);
    setUploadedImage(null);
    setCustomLayoutElements([]);
  };

  // Interactive Slider Events (Before & After Toggle)
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // 2D Layout Map dragging helper
  const handleLayoutElementMouseDown = (index: number) => {
    setDraggingElementIndex(index);
    setSelectedLayoutElement(customLayoutElements[index]);
  };

  const handleLayoutContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingElementIndex === null) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // update within bounds
    const updated = [...customLayoutElements];
    updated[draggingElementIndex] = {
      ...updated[draggingElementIndex],
      xPercent: Math.max(2, Math.min(98, Math.round(x))),
      yPercent: Math.max(2, Math.min(98, Math.round(y)))
    };
    setCustomLayoutElements(updated);
    setSelectedLayoutElement(updated[draggingElementIndex]);
  };

  // AR sandbox drag & drop gestures
  const handleArMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedArItemId(id);
    const index = arItems.findIndex(item => item.id === id);
    setArDragState({
      isDragging: true,
      startX: e.clientX - arItems[index].x,
      startY: e.clientY - arItems[index].y,
      itemIndex: index
    });
  };

  const handleArMouseMove = (e: React.MouseEvent) => {
    if (!arDragState || !arDragState.isDragging) return;
    const newItems = [...arItems];
    newItems[arDragState.itemIndex] = {
      ...newItems[arDragState.itemIndex],
      x: e.clientX - arDragState.startX,
      y: e.clientY - arDragState.startY
    };
    setArItems(newItems);
  };

  const handleArMouseUp = () => {
    setArDragState(null);
  };

  // Rotate AR Item
  const rotateArItem = (id: number) => {
    setArItems(arItems.map(item => {
      if (item.id === id) {
        return { ...item, r: (item.r + 45) % 360 };
      }
      return item;
    }));
  };

  // Resize AR Item
  const scaleArItem = (id: number, factor: number) => {
    setArItems(arItems.map(item => {
      if (item.id === id) {
        const nextScale = Math.max(0.4, Math.min(2.5, item.s + factor));
        return { ...item, s: parseFloat(nextScale.toFixed(1)) };
      }
      return item;
    }));
  };

  return (
    <div id="designer-root" className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#12110F] text-[#FAF9F5] selection:bg-[#3E3A35] selection:text-white' : 'bg-[#FAF9F5] text-[#2C2723] selection:bg-[#EAE5D9] selection:text-[#2C2723]'} font-sans antialiased`}>
      
      {/* Sleek Minimalist Studio Header */}
      <header id="main-header" className={`sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-[#12110F]/90 border-b border-[#2D2924]' : 'bg-[#FAF9F5]/90 border-b border-[#E5E3DF]'} backdrop-blur-md px-4 py-3.5 sm:px-8`}>
        <div id="header-wrapper" className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div id="brand-logo" className="flex items-center gap-3">
            <div id="logo-icon-card" className="bg-[#1C1C1C] text-[#FFF] p-2 rounded-lg flex items-center justify-center border border-[#3E3830]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h1 id="brand-title" className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} flex items-center gap-2`}>
                ALCOVE AI <span className={`text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#2D2924] text-[#A8A49C]' : 'bg-[#E5E3DF] text-[#6E6B64]'}`}>v2.5 Studio</span>
              </h1>
              <span id="brand-tagline" className={`text-xs ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'} block font-medium`}>مُصمم الديكور الذكي وتقليص الميزانيات</span>
            </div>
          </div>

          <div id="system-stats" className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#2E2A25] border-[#443E38] text-amber-300 hover:bg-[#3E3830] hover:scale-105' 
                  : 'bg-[#FFFFFF] border-[#E5E3DF] text-amber-600 hover:bg-[#FAF9F5] hover:scale-105'
              }`}
              title={isDarkMode ? 'تفعيل الوضع المضيء / Light Mode' : 'تفعيل الوضع الداكن / Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 animate-[spin_10s_linear_infinite]" /> : <Moon className="w-4 h-4" />}
            </button>

            <div id="api-status-pill" className={`flex items-center gap-2 border rounded-full px-3 py-1 text-xs transition duration-300 ${
              isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-[#FFFFFF] border-[#E5E3DF]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
              <span className={`font-mono text-[11px] transition duration-300 ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6D6B65]'}`}>
                {process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'Gemini 3.5 Engine Connected' : 'Simulating Local Offline Sandbox'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main id="workspace-layout" className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Creative parameters & Control Center */}
        <div id="control-center-panel" className="lg:col-span-5 space-y-6">
          
          <div id="studio-card-intro" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2925]' : 'bg-[#FFFFFF] border-[#E5E3DF]'} border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors duration-300`}>
            <div className={`absolute right-0 top-0 ${isDarkMode ? 'bg-[#2E2924]' : 'bg-[#EFECE5]'} h-20 w-24 rounded-bl-[100px] -z-0 opacity-50`}></div>
            <div className="relative z-10">
              <h2 id="intro-title" className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} flex items-center gap-2 mb-1.5 direction-rtl text-right`}>
                <span>تخيل جديد لفراغك الشخصي</span>
                <Compass className="w-5 h-5 text-amber-600" />
              </h2>
              <p id="intro-description" className={`text-xs ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'} leading-relaxed mb-4 text-right`}>
                التقط صورة لغرفتك، حدد طرازك الديكوري والحد الأقصى لميزانيتك بالجنيه المصري وسيقوم الذكاء الاصطناعي بإعادة رسم الغرفة بالكامل، ورصد الفرش وتكوين مخطط توزيع أثاث ثنائي أبعاد ودليل تسوق من إيكيا وهومزمارت.
              </p>

              {/* Sample Preset Selection to trigger fast visualization instantly */}
              <div id="presets-container" className={`border-t ${isDarkMode ? 'border-[#3D3730]' : 'border-[#F1EFEA]'} pt-4.5`}>
                <span className={`text-[11px] uppercase tracking-wider font-mono ${isDarkMode ? 'text-amber-400' : 'text-[#8A867E]'} block mb-2.5 text-right font-bold`}>بسرعة: جرّب فراغ مسبق التشخيص ✦</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      id={`btn-${preset.id}`}
                      onClick={() => handleLoadPreset(preset.id)}
                      className={`text-right border transition duration-200 group relative overflow-hidden p-2.5 rounded-xl ${
                        isDarkMode 
                          ? 'border-[#2D2924] hover:border-amber-400 bg-[#25221F] hover:bg-[#2F2B27]' 
                          : 'border-[#E5E3DF] hover:border-[#1C1C1C] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} block`}>{preset.nameAr}</span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-[#A09A92]' : 'text-[#8A867E]'} block font-mono`}>{preset.nameEn}</span>
                      <div className={`absolute left-1 bottom-1 text-[9px] px-1 rounded font-mono ${isDarkMode ? 'bg-[#3D3730] text-[#B0A79E]' : 'bg-[#EBE9E3] text-[#7F7C73]'}`}>
                        {preset.budget.toLocaleString()} {preset.currency}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Form */}
          <div id="decorator-form-card" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-[#FFFFFF] border-[#E5E3DF]'} border rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300`}>
            
            {/* Step 1: Room Type Selector */}
            <div id="param-room-type" className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#6E6B64]'} flex items-center justify-between`}>
                <span>1. نوع الفراغ المعماري / Room Type</span>
                <Layers className={`w-4 h-4 ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'}`} />
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'living', labelAr: 'معيشة', labelEn: 'Living' },
                  { id: 'bedroom', labelAr: 'نوم', labelEn: 'Bedroom' },
                  { id: 'kitchen', labelAr: 'مطبخ', labelEn: 'Kitchen' },
                  { id: 'office', labelAr: 'مكتب', labelEn: 'Office' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    id={`room-opt-${r.id}`}
                    onClick={() => setRoomType(r.id)}
                    className={`p-2.5 rounded-xl border text-center transition duration-150 ${
                      roomType === r.id 
                        ? isDarkMode 
                          ? 'border-amber-400 bg-amber-600 text-white shadow-sm' 
                          : 'border-[#1C1C1C] bg-[#1C1C1C] text-[#FFF] shadow-sm' 
                        : isDarkMode
                          ? 'border-[#3D3730] bg-[#25221F] hover:border-[#8A867E] text-white'
                          : 'border-[#E5E3DF] hover:border-[#8A867E] text-[#2C2723]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{r.labelAr}</span>
                    <span className="text-[9px] block opacity-80 uppercase tracking-tight font-mono">{r.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Decorative Style selection with Cards */}
            <div id="param-style" className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#6E6B64]'} flex items-center justify-between`}>
                <span>2. الطراز الجمالي المراد / Interior Style</span>
                <Palette className={`w-4 h-4 ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'}`} />
              </label>
              
              <div className={`grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1 border ${isDarkMode ? 'border-[#2D2924]' : 'border-[#FAF9F5]'} rounded-xl`}>
                {stylesInfo.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    id={`style-opt-${s.id}`}
                    onClick={() => setStyle(s.id)}
                    className={`p-3 rounded-xl border text-right transition duration-200 flex flex-col justify-between h-[85px] group ${
                      style === s.id 
                        ? isDarkMode 
                          ? 'border-amber-400 bg-[#352F2A] shadow-inner' 
                          : 'border-[#1C1C1C] bg-[#FAF9F5] shadow-inner' 
                        : isDarkMode
                          ? 'border-[#2D2924] hover:border-[#8A867E] bg-[#25221F]'
                          : 'border-[#E5E3DF] hover:border-[#8A867E] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-2.5 h-2.5 rounded-full ${style === s.id ? 'bg-amber-600 scale-125' : 'bg-[#E5E3DF]'} transition-transform duration-150`}></div>
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>{s.nameAr}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] ${isDarkMode ? 'text-[#A09A92]' : 'text-[#8A867E]'} block font-mono font-semibold uppercase`}>{s.nameEn}</span>
                      <p className={`text-[9px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6D6B65]'} mt-1 line-clamp-1 leading-tight`}>{s.descAr}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Realistic Intelligent Budget Slider */}
            <div id="param-budget" className={`space-y-3 p-4 rounded-xl border ${isDarkMode ? 'bg-[#282420] border-[#3D3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#6E6B64]'}`}>3. الحد الأقصى للميزانية / Budget Limit</span>
                <Coins className="w-4 h-4 text-amber-600" />
              </div>

              <div className={`flex items-center justify-between border rounded-xl px-3 py-2 ${isDarkMode ? 'bg-[#1E1C19] border-[#3D3730]' : 'bg-white border-[#E5E3DF]'}`}>
                <input
                  type="number"
                  id="budget-input"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(1000, parseInt(e.target.value) || 0))}
                  className={`w-full text-base font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}
                />
                
                {/* Currency select toggle */}
                <div className={`flex items-center gap-1 border-l pl-2.5 ml-2 ${isDarkMode ? 'border-[#3D3730]' : 'border-[#E5E3DF]'}`}>
                  {['EGP', 'USD', 'SAR'].map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      id={`curr-toggle-${curr}`}
                      onClick={() => setCurrency(curr)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        currency === curr 
                          ? isDarkMode
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#1C1C1C] text-[#FFF]' 
                          : isDarkMode
                            ? 'text-[#AAA59C] hover:bg-[#322C27]'
                            : 'text-[#8A867E] hover:bg-[#E5E3DF]'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for smooth visual feedback */}
              <div className="space-y-1">
                <input
                  type="range"
                  id="budget-range"
                  min={currency === 'USD' ? 500 : 5000}
                  max={currency === 'USD' ? 25000 : 250000}
                  step={currency === 'USD' ? 250 : 5000}
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className={`flex items-center justify-between text-[9px] font-mono ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'}`}>
                  <span>MIN: {currency === 'USD' ? '500' : '5,000'}</span>
                  <span>MED: {currency === 'USD' ? '12,000' : '125,000'}</span>
                  <span>MAX: {currency === 'USD' ? '25,000' : '250,000'}</span>
                </div>
              </div>
            </div>

            {/* Step 4: Raw Photo Capture / Upload Box */}
            <div id="param-photo-field" className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#A8A49C]' : 'text-[#6E6B64]'} block text-right`}>
                4. رفع أو التقاط صورة الغرفة الحالية / Scan Room
              </label>

              {/* Upload Workspace Box */}
              {!uploadedImage && !isCameraActive ? (
                <div 
                  id="upload-dropzone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center space-y-3 cursor-pointer transition ${
                    isDarkMode 
                      ? 'border-[#3D3730] hover:border-amber-400 bg-[#25221F] hover:bg-[#2A2622]' 
                      : 'border-[#E5E3DF] hover:border-[#1C1C1C] bg-white'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={`inline-flex p-3 rounded-full ${isDarkMode ? 'bg-[#3D3730] text-amber-300' : 'bg-[#FAF9F5] text-[#6E6B64]'}`}>
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>سحب وإفلات صورة الأوضة أو تصفح ملفاتك</span>
                    <span className={`text-[10px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'} block mt-1`}>Drag Room photo here or Browse files</span>
                  </div>
                  <input
                    type="file"
                    id="file-uploader"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="pt-2">
                    <span className={`text-[10px] border rounded px-2.5 py-1 inline-flex items-center gap-1.5 ${
                      isDarkMode ? 'bg-[#1E1C19] border-[#3D3730] text-[#AAA59C]' : 'bg-[#FAF9F5] border-[#E5E3DF] text-[#6D6B65]'
                    }`}>
                      Recommended: High resolution, wide angle JPG/PNG
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Interactive Live Camera Stream */}
              {isCameraActive ? (
                <div id="live-camera-feed" className={`border rounded-xl overflow-hidden bg-black relative ${isDarkMode ? 'border-amber-400' : 'border-[#1C1C1C]'}`}>
                  <video 
                    ref={videoRef} 
                    id="camera-video"
                    className="w-full h-48 object-cover scale-x-[-1]"
                    playsInline 
                    muted
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2.5 px-3">
                    <button
                      type="button"
                      id="btn-capture-snap"
                      onClick={capturePhoto}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      <span>التقاط لقطة / Capture</span>
                    </button>
                    <button
                      type="button"
                      id="btn-cancel-cam"
                      onClick={stopCamera}
                      className="bg-zinc-800 hover:bg-zinc-900 border border-zinc-700 text-white rounded-lg p-1.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Thumbnail representation if uploaded */}
              {uploadedImage && !isCameraActive ? (
                <div id="uploaded-preview-container" className={`border rounded-xl overflow-hidden p-3 space-y-3 ${
                  isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'
                }`}>
                  <div className={`relative aspect-video rounded-lg overflow-hidden group ${isDarkMode ? 'bg-[#25221F]' : 'bg-[#FAF9F5]'}`}>
                    <img 
                      src={uploadedImage} 
                      alt="Current User Room uploaded" 
                      id="uploaded-preview-img"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-tight bg-[#1C1C1C] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#3D3730]">
                        <Upload className="w-3.5 h-3.5" />
                        Original Room Backdrop
                      </span>
                    </div>

                    <button
                      type="button"
                      id="btn-remove-preview"
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 p-1 rounded-full shadow cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-mono ${isDarkMode ? 'text-[#A09A92]' : 'text-[#6D6B65]'}`}>Resolution checked (OK)</span>
                    <span className={`font-bold cursor-pointer hover:underline flex items-center gap-1 ${isDarkMode ? 'text-amber-400' : 'text-[#1C1C1C]'}`} onClick={() => fileInputRef.current?.click()}>
                      إعادة رفع صورة أخرى / Replace
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Trigger Buttons when no upload / to use camera */}
              {!uploadedImage && !isCameraActive ? (
                <div className="text-center">
                  <button
                    type="button"
                    id="btn-trigger-camera"
                    onClick={startCamera}
                    className={`w-full border text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition ${
                      isDarkMode 
                        ? 'bg-[#25221F] border-[#3D3730] hover:border-[#8A867E] hover:bg-[#2F2A25] text-white' 
                        : 'bg-white border-[#E5E3DF] hover:border-[#8A867E] hover:bg-[#FAF9F5] text-[#2C2723]'
                    }`}
                  >
                    <Camera className="w-4 h-4 pr-1 text-amber-500" />
                    <span>افتح كاميرا الموبايل لتصوير غرفتك الحالية</span>
                  </button>
                </div>
              ) : null}
            </div>

            {/* Form Actions: Generating Trigger */}
            <div id="form-action-container" className="pt-2">
              <button
                type="button"
                id="btn-trigger-generation"
                disabled={isLoading}
                onClick={handleGenerateDesign}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-md ${
                  isLoading 
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                    : isDarkMode
                      ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.01] cursor-pointer'
                      : 'bg-[#1C1C1C] hover:bg-amber-700 text-[#FFF] hover:scale-[1.01] cursor-pointer'
                }`}
              >
                <Sparkles className={`w-4 h-4 text-amber-300 ${isLoading ? 'animate-spin' : ''}`} />
                <span>
                  {isLoading ? 'جاري التحيل الفراغي بالتصميم...' : 'توليد الديكور الجديد بالذكاء الاصطناعي 🚀'}
                </span>
              </button>

              {apiError && (
                <div id="api-error-alert" className={`mt-3 border rounded-xl p-3 flex gap-2.5 text-xs leading-relaxed text-right direction-rtl ${
                  isDarkMode ? 'bg-red-950/40 border-red-900/60 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <h4 className="font-bold">تنبيه بالنظام:</h4>
                    <p>{apiError}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Quick Informational / Educational Footer */}
          <div id="quick-tips-card" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-[#FFFFFF] border-[#E5E3DF]'} border rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} flex items-center gap-1.5 text-right direction-rtl`}>
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>نصائح لالتقاط صورة معمارية سليمة:</span>
            </h4>
            <ul className={`text-[11px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'} space-y-1.5 list-disc list-inside text-right direction-rtl`}>
              <li>قف في زاوية الغرفة للحصول على أقصى اتساع بصري للعدسة.</li>
              <li>افتح ستائر شمس النهار لتجنب تكوين ظلال شديدة على الكنبة والسرير.</li>
              <li>أبعد الأشياء الفوضوية والورق الصغير لتسهيل رصد الأثاث الحقيقي.</li>
            </ul>
          </div>

        </div>

        {/* Right Side: Design outputs & Immersive Interactive Workspace */}
        <div id="design-results-panel" className="lg:col-span-7 space-y-6">
          
          {/* Default Greeting: Waiting for action */}
          {!isLoading && !isRedesigned && (
            <div id="empty-state-greeting" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'} border rounded-2xl p-10 shadow-sm text-center space-y-6 flex flex-col items-center justify-center h-full min-h-[550px] relative overflow-hidden transition-colors duration-300`}>
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(#2D2924_1px,transparent_1px)]' : 'bg-[radial-gradient(#ECE7E1_1px,transparent_1px)]'} [background-size:24px_24px] opacity-40`}></div>
              
              <div className={`z-10 border p-6 rounded-full inline-flex shadow ${isDarkMode ? 'bg-[#25221F] border-[#3D3730] text-amber-400' : 'bg-[#FAF9F5] border-[#E5E3DF] text-amber-800'}`}>
                <Compass className="w-10 h-10 animate-[spin_5s_linear_infinite]" />
              </div>

              <div className="space-y-2.5 z-10 max-w-md">
                <h2 id="empty-state-title" className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} ArabicText`}>أستوديو إعداد وتجربة الفراغات</h2>
                <p className={`text-xs ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'} leading-relaxed`}>
                  هنا ستشاهد تحفة الذكاء الاصطناعي لغرفتك كصورة فوتوغرافية فائقة الجودة إلى جانب تفاصيل الترتيب، تقديرات ميزانية Jotun، وقطع الأثاث الجاهزة للشراء لتوفير الجهد والمال.
                </p>
              </div>

              {/* Direct feature callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg z-10 pt-4">
                <div className={`border p-3 rounded-xl text-center ${isDarkMode ? 'bg-[#25221F] border-[#3D3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'}`}>
                  <Sliders className={`w-4 h-4 mx-auto mb-1.5 ${isDarkMode ? 'text-amber-400' : 'text-[#1C1C1C]'}`} />
                  <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-white' : ''}`}>مقارنة تفاعلية</span>
                  <span className={`text-[9px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'} block`}>قبل وبعد بالسحب</span>
                </div>
                <div className={`border p-3 rounded-xl text-center ${isDarkMode ? 'bg-[#25221F] border-[#3D3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'}`}>
                  <Grid className={`w-4 h-4 mx-auto mb-1.5 ${isDarkMode ? 'text-amber-400' : 'text-[#1C1C1C]'}`} />
                  <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-white' : ''}`}>مخطط ثنائي الأبعاد</span>
                  <span className={`text-[9px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'} block`}>تحريك وتخصيص الأثاث</span>
                </div>
                <div className={`border p-3 rounded-xl text-center ${isDarkMode ? 'bg-[#25221F] border-[#3D3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'}`}>
                  <ShoppingBag className={`w-4 h-4 mx-auto mb-1.5 ${isDarkMode ? 'text-amber-400' : 'text-[#1C1C1C]'}`} />
                  <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-white' : ''}`}>تكامل المتاجر بمصر</span>
                  <span className={`text-[9px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'} block`}>أسعار ومصادر موثوقة</span>
                </div>
              </div>

              {/* CTA invitation to load preset */}

              {/* CTA invitation to load preset */}
              <div className={`z-10 pt-2 text-[11px] font-medium flex items-center gap-1.5 ${isDarkMode ? 'text-amber-400/80' : 'text-[#8A867E]'}`}>
                <span>تلميح: اضغط على زر "بسرعة: جرّب فراغ مسبق التشخيص" على اليسار لملء البيانات والتصميم فوراً!</span>
              </div>
            </div>
          )}

          {/* If loading model, show the Loading screen! */}
          {isLoading && (
            <div id="ai-loading-card" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'} border rounded-2xl p-10 shadow-sm text-center space-y-6 flex flex-col items-center justify-center h-full min-h-[550px] relative overflow-hidden transition-colors duration-300`}>
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(#2D2924_1px,transparent_1px)]' : 'bg-[radial-gradient(#ECE7E1_1px,transparent_1px)]'} [background-size:24px_24px] opacity-40`}></div>
              
              <div className={`z-10 border p-6 rounded-full inline-flex shadow ${isDarkMode ? 'bg-[#25221F] border-[#3D3730] text-amber-400' : 'bg-[#FAF9F5] border-[#E5E3DF] text-amber-800'}`}>
                <Compass className="w-10 h-10 animate-spin text-amber-600" />
              </div>

              <div className="space-y-4 z-10 max-w-md">
                <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>جاري توليد الديكور والتخطيط الذكي</h2>
                <div id="loading-step-progress" className={`text-xs font-mono py-1 px-3 rounded-full inline-block border ${
                  isDarkMode ? 'bg-amber-950/40 border-amber-900 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {loadingStep || 'بدء الاتصال بالذكاء الاصطناعي...'}
                </div>
                <p className={`text-[11px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'} leading-relaxed`}>
                  يقوم البرنامج الآن بقراءة وتحليل مكونات الغرفة وتنسيق الأثاث باستخدام Gemini AI، وتوليد اقتراحات الديكور الحديث والميزانية وجدول التسوق.
                </p>
              </div>
            </div>
          )}

          {/* Main workspace for redesign results */}
          {isRedesigned && !isLoading && (
            <div className="space-y-6">
              {/* Tab Navigation header */}
              <div id="interactive-workspace-tabs" className={`flex flex-wrap gap-2 p-1.5 border rounded-2xl shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'}`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('compare')}
                  className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 ${
                    activeTab === 'compare'
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1C1C1C] text-[#FFF]'
                      : isDarkMode ? 'text-[#AAA59C] hover:bg-[#25221F]' : 'text-[#6D6B65] hover:bg-[#FAF9F5] hover:text-[#1C1C1C]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>المقارنة / Compare</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('layout')}
                  className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 ${
                    activeTab === 'layout'
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1C1C1C] text-[#FFF]'
                      : isDarkMode ? 'text-[#AAA59C] hover:bg-[#25221F]' : 'text-[#6D6B65] hover:bg-[#FAF9F5] hover:text-[#1C1C1C]'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>المُخطط 2D / Layout</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('budget')}
                  className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 ${
                    activeTab === 'budget'
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1C1C1C] text-[#FFF]'
                      : isDarkMode ? 'text-[#AAA59C] hover:bg-[#25221F]' : 'text-[#6D6B65] hover:bg-[#FAF9F5] hover:text-[#1C1C1C]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>الألوان والميزانية / Budget</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shopping')}
                  className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 ${
                    activeTab === 'shopping'
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1C1C1C] text-[#FFF]'
                      : isDarkMode ? 'text-[#AAA59C] hover:bg-[#25221F]' : 'text-[#6D6B65] hover:bg-[#FAF9F5] hover:text-[#1C1C1C]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>دليل الشراء / Stores</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ar')}
                  className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 ${
                    activeTab === 'ar'
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1C1C1C] text-[#FFF]'
                      : isDarkMode ? 'text-[#AAA59C] hover:bg-[#25221F]' : 'text-[#6D6B65] hover:bg-[#FAF9F5] hover:text-[#1C1C1C]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>الواقع المعزز / AR</span>
                </button>
              </div>

              {activeTab === 'compare' && (
                <div id="tab-pane-compare" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'} border rounded-2xl p-4 shadow-sm space-y-4 transition-colors duration-300`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>المقارنة الفورية للمظهر النهائي للغرفة</h3>
                      <p className={`text-[11px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'}`}>اسحب المقبض الأوسط يميناً ويساراً لمشاهدة التحول بالديكور الجديد</p>
                    </div>
                    <span className={`border text-[10px] px-2.5 py-1 uppercase font-mono rounded ${isDarkMode ? 'bg-[#25221F] border-[#3D3730] text-[#AAA59C]' : 'bg-[#FAF9F5] border-[#E5E3DF] text-[#6D6B65]'}`}>
                      Interactive Swipe
                    </span>
                  </div>

                  {/* Interactive Slider Container */}
                  <div 
                    ref={sliderContainerRef}
                    id="slider-interaction-stage"
                    onMouseMove={handleSliderMove}
                    onTouchMove={handleSliderMove}
                    className={`relative aspect-[16/10] sm:aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border ${isDarkMode ? 'border-[#3D3730]' : 'border-[#E5E3DF]'}`}
                  >
                    {/* Before Image (Original Room) */}
                    <img 
                      src={originalImageUrl} 
                      alt="Before Room Raw Setup" 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* After Image (Redesigned Model) with dynamically adjusted clip-path */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    >
                      <img 
                        src={redesignedImageUrl} 
                        alt="After Redesigned Setup Render" 
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Left & Right custom labels overlay */}
                    <div className="absolute left-3 top-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] sm:text-xs font-mono font-bold rounded">
                      RECONSTRUCTED (AFTER)
                    </div>
                    <div className="absolute right-3 top-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] sm:text-xs font-mono font-bold rounded">
                      BEFORE (ORIGINAL)
                    </div>

                    {/* Slider Vertical Handle line & Dragging Pill */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-[#1C1C1C] p-2 rounded-full border border-[#E5E3DF] shadow-lg flex items-center justify-center">
                        <Sliders className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic Concept Statement Card */}
                  {analysisData?.remodelingConcept && (
                    <div id="remodeling-concept-summary" className={`border rounded-xl p-5 text-right direction-rtl space-y-2 ${
                      isDarkMode ? 'bg-[#25221F] border-[#3D3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-[#3D3730] text-amber-300' : 'bg-amber-100 text-amber-800'}`}>مفهوم التصميم المقترح</span>
                        <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>{analysisData.remodelingConcept.title}</h4>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'}`}>
                        {analysisData.remodelingConcept.description}
                      </p>

                      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-[11px] border-t ${isDarkMode ? 'border-[#3D3730]' : 'border-[#E5E3DF]'}`}>
                        <div>
                          <strong className={`${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} block mb-1`}>طلاء الجدران:</strong>
                          <span className={`${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'}`}>{analysisData.remodelingConcept.wallsRecommendation}</span>
                        </div>
                        <div>
                          <strong className={`${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} block mb-1`}>التربيعات والأرضية:</strong>
                          <span className={`${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'}`}>{analysisData.remodelingConcept.flooringRecommendation}</span>
                        </div>
                        <div>
                          <strong className={`${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'} block mb-1`}>خطة الإضاءة المسائية:</strong>
                          <span className={`${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'}`}>{analysisData.remodelingConcept.lightingRecommendation}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reset workflow triggers */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-[#8A867E] flex items-center gap-1 font-mono">
                      <Info className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Hold & Drag handle sideways across screens</span>
                    </div>

                    <button
                      type="button"
                      id="btn-restart-flow"
                      onClick={handleReset}
                      className={`border text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition duration-150 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-[#25221F] border-[#3D3730] hover:border-red-500 hover:text-red-500 text-[#AAA59C]' 
                          : 'bg-white border-[#E5E3DF] hover:border-red-600 hover:text-red-600 text-[#6D6B65]'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>إعادة البداية وصنع تصميم آخر</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Output Tab Body 2: 2D Spatial Furniture Sandbox */}
              {activeTab === 'layout' && (
                <div id="tab-pane-layout" className={`${isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'} border rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300`}>
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
                      <Map className="w-5 h-5 text-amber-700" />
                      <span>المُخطط الذكي المقترح لتخطيط 2D / Blueprints Stage</span>
                    </h3>
                    <p className={`text-[11px] ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'}`}>
                      اسحب الدوائر والأثاث برأس إصبعك لتنظيم الغرفة، ثم اضغط على العنصر لقراءة التوصيات بالتوجيه السليم.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sandbox stage representation */}
                    <div className="md:col-span-2 space-y-2">
                      <div 
                        id="layout-plan-blueprint-stage"
                        onMouseMove={handleLayoutContainerMouseMove}
                        onMouseUp={() => setDraggingElementIndex(null)}
                        className={`relative w-full aspect-square border-2 rounded-2xl overflow-hidden p-4 select-none shadow-inner ${
                          isDarkMode ? 'bg-[#151412] border-[#2D2924]' : 'bg-[#FAF9F5] border-[#EBE9E3]'
                        }`}
                      >
                        {/* Blueprint decorative lines */}
                        <div className={`absolute inset-0 [background-size:20px_20px] opacity-60 ${
                          isDarkMode ? 'bg-[radial-gradient(#3E3932_1px,transparent_1px)]' : 'bg-[radial-gradient(#C3BDB3_1px,transparent_1px)]'
                        }`}></div>
                        <div className={`absolute top-1/2 left-0 right-0 border-t border-dashed ${isDarkMode ? 'border-[#2D2924]/70' : 'border-[#E5E3DF]/70'}`}></div>
                        <div className={`absolute left-1/2 top-0 bottom-0 border-l border-dashed ${isDarkMode ? 'border-[#2D2924]/70' : 'border-[#E5E3DF]/70'}`}></div>

                        {/* Room boundary wall visuals indices */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-[#8A867E]">WALL UP (شمالي)</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-[#8A867E]">WALL DOWN (جنوبي)</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-mono tracking-widest text-[#8A867E]">WALL LEFT</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[9px] font-mono tracking-widest text-[#8A867E]">WALL RIGHT</div>

                        {/* Dynamic Draggable Furniture Pins */}
                        {customLayoutElements.map((el, idx) => {
                          const isSelected = selectedLayoutElement?.label === el.label;
                          return (
                            <div
                              key={idx}
                              id={`draggable-pin-${idx}`}
                              onMouseDown={() => handleLayoutElementMouseDown(idx)}
                              className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-md transition-shadow group ${
                                isSelected 
                                  ? 'bg-[#1C1C1C] text-white border-2 border-amber-300 scale-110 z-30 ring-4 ring-amber-500/15' 
                                  : isDarkMode
                                    ? 'bg-[#2E2A25] text-white border border-[#3D3730] hover:border-amber-400 z-20 hover:scale-105'
                                    : 'bg-white text-[#1C1C1C] border border-[#C5BFB5] hover:border-[#1C1C1C] z-20 hover:scale-105'
                              }`}
                              style={{ left: `${el.xPercent}%`, top: `${el.yPercent}%` }}
                            >
                              <Move className={`w-3.5 h-3.5 absolute -top-1 -right-1 p-0.5 rounded-full shadow bg-[#FFF] text-[#1C1C1C] border border-[#E5E3DF] opacity-0 group-hover:opacity-100 transition-opacity`} />
                              
                              {/* Furniture specific indicator letter inside circle */}
                              <span className="text-[10px] font-bold uppercase tracking-tight leading-none">
                                {el.furnitureType === 'couch' ? '🛋️' : el.furnitureType === 'bed' ? '🛏️' : el.furnitureType === 'lamp' ? '💡' : el.furnitureType === 'plant' ? '🌿' : '📦'}
                              </span>
                              <span className="text-[7px] text-center font-bold px-1 truncate w-full block mt-0.5">
                                {el.label.split(' ')[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#8A867E]">
                        <span>Drag & relocate dots horizontally</span>
                        <span className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded ${isDarkMode ? 'bg-[#3D3730] text-amber-300' : 'bg-[#F1EFEA] text-[#2E2D27]'}`}>
                          <Info className={`w-3 h-3 ${isDarkMode ? 'text-amber-300' : 'text-[#1C1C1C]'}`} />
                          تعديل مخطط المهندس الداخلي
                        </span>
                      </div>
                    </div>

                    {/* Explanatory Recommendations List */}
                    <div className="space-y-4">
                      {selectedLayoutElement ? (
                        <div id="selected-pin-details-bubble" className={`border rounded-xl p-4 space-y-3 transition-all ${
                          isDarkMode ? 'bg-[#25221F] border-amber-400' : 'bg-[#FAF9F5] border-[#1C1C1C]'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {selectedLayoutElement.furnitureType === 'couch' ? '🛋️' : selectedLayoutElement.furnitureType === 'bed' ? '🛏️' : selectedLayoutElement.furnitureType === 'lamp' ? '💡' : selectedLayoutElement.furnitureType === 'plant' ? '🌿' : '📦'}
                            </span>
                            <div>
                              <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>{selectedLayoutElement.label}</h4>
                              <span className="text-[9px] uppercase font-mono text-[#8A867E]">Item Spatial Guide</span>
                            </div>
                          </div>
                          
                          <div className={`p-3 rounded-lg border text-xs text-right direction-rtl space-y-1.5 ${
                            isDarkMode ? 'bg-[#1E1C19] border-[#3D3730]' : 'bg-white border-[#E5E3DF]'
                          }`}>
                            <span className="text-[9px] text-amber-500 block font-bold">التوصية بالتوزيع:</span>
                            <p className={`leading-relaxed text-right ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#2C2723]'}`}>
                              {selectedLayoutElement.rearrangementText}
                            </p>
                            <span className={`text-[8px] block font-mono text-[#8A867E]`}>
                              Coordinates: X_pct:{selectedLayoutElement.xPercent}, Y_pct:{selectedLayoutElement.yPercent}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className={`border rounded-xl p-4 text-center h-full flex flex-col items-center justify-center py-10 ${
                          isDarkMode ? 'bg-[#25221F] border-[#3C3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'
                        }`}>
                          <Compass className="w-8 h-8 text-[#8A867E] mb-2 animate-bounce" />
                          <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>لم يتم اختيار أي عنصر</span>
                          <span className="text-[10px] text-[#8A867E] block mt-1">اضغط على أي دائرة بالمخطط لرؤية نصيحة الاستغلال</span>
                        </div>
                      )}

                      {/* Detected list for full inventory reference */}
                      <div className={`border rounded-xl p-3.5 space-y-3 ${
                        isDarkMode ? 'bg-[#1E1C19] border-[#2D2924]' : 'bg-white border-[#E5E3DF]'
                      }`}>
                        <span className={`text-[10px] font-bold tracking-wider uppercase block ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#6E6B64]'}`}>الأثاث المرصود بالغرفة الحالية:</span>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {analysisData?.furnitureDetected.map((item, idx) => (
                            <div key={idx} className={`p-2 rounded-lg border relative text-right direction-rtl ${
                              isDarkMode ? 'bg-[#25221F] border-[#3D3730]' : 'bg-[#FAF9F5] border-[#E5E3DF]'
                            }`}>
                              <span className={`text-[9px] font-bold block ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>{item.item}</span>
                              <div className={`flex items-center gap-1.5 mt-1 border-t pt-1 ${isDarkMode ? 'border-[#3D3730]' : 'border-[#EFECE5]'}`}>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-[#3D3730] text-[#AAA59C]' : 'bg-[#EBE9E3] text-[#6E6B64]'}`}>
                                  دقة: {item.confidence}
                                </span>
                                <span className={`text-[8px] line-clamp-1 ${isDarkMode ? 'text-[#AAA59C]' : 'text-[#8A867E]'}`}>
                                  توصية: {item.recommendation}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Output Tab Body 3: Budget list & Palette colors */}
              {activeTab === 'budget' && (
                <div id="tab-pane-budget" className="bg-white border border-[#E5E3DF] rounded-2xl p-6 shadow-sm space-y-6">
                  
                  {/* Swatches block comparing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-[#E5E3DF]">
                    {/* Original Swatch */}
                    <div className="space-y-2 text-right direction-rtl">
                      <span className="text-xs font-bold text-[#6E6B64] tracking-wider uppercase">لوحة الألوان الحالية للغرفة:</span>
                      <div className="flex items-stretch justify-start h-14 rounded-xl overflow-hidden border border-[#E5E3DF]">
                        {analysisData?.aestheticAnalysis.colorPalette.map((hex, i) => (
                          <div 
                            key={i} 
                            id={`color-orig-${i}`}
                            className="flex-1 flex items-end p-1.5 group cursor-pointer transition relative" 
                            style={{ backgroundColor: hex }}
                            onClick={() => navigator.clipboard.writeText(hex)}
                            title="Copy Hex Code"
                          >
                            <span className="text-[8px] text-white opacity-0 group-hover:opacity-100 font-mono tracking-tight bg-black/60 rounded px-1 absolute top-1 left-1">
                              {hex}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#8A867E]">تتسم بـ: {analysisData?.aestheticAnalysis.currentStyle}</span>
                    </div>

                    {/* New Proposed Swatch */}
                    <div className="space-y-2 text-right direction-rtl">
                      <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">لوحة الألوان المقترحة للطراز الجديد ✦:</span>
                      <div className="flex items-stretch justify-start h-14 rounded-xl overflow-hidden border border-[#1C1C1C]">
                        {analysisData?.aestheticAnalysis.recommendedPalette.map((hex, i) => (
                          <div 
                            key={i} 
                            id={`color-rec-${i}`}
                            className="flex-1 flex items-end p-1.5 group cursor-pointer hover:flex-[1.5] transition-all relative" 
                            style={{ backgroundColor: hex }}
                            onClick={() => navigator.clipboard.writeText(hex)}
                            title="Copy Hex Code"
                          >
                            <span className="text-[8px] text-white opacity-0 group-hover:opacity-100 font-mono tracking-tight bg-black/60 rounded px-1 absolute top-1 left-1">
                              {hex}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-900 font-bold">انعكاس الإضاءة ليلاً: {analysisData?.aestheticAnalysis.lightingRating}</span>
                    </div>
                  </div>

                  {/* Curated itemized Budget breakdown */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[10px] bg-[#FAF9F5] border border-[#E5E3DF] text-[#6D6B65] font-mono px-2 py-1 rounded">
                        TOTAL ESTIMATED: {analysisData?.budgetBreakdown.reduce((sum, item) => sum + item.estimatedPrice, 0).toLocaleString()} {currency}
                      </span>
                      <h3 className="text-base font-bold text-[#1C1C1C] flex items-center justify-end gap-1.5 text-right w-full sm:w-auto">
                        <Coins className="w-5 h-5 text-amber-600" />
                        <span>تقليص وإدارة الميزانية الذكية المقترحة</span>
                      </h3>
                    </div>

                    <div className="overflow-x-auto border border-[#E5E3DF] rounded-xl">
                      <table className="w-full text-right divide-y divide-[#E5E3DF]">
                        <thead className="bg-[#FAF9F5] text-[10px] font-bold text-[#6D6B65] tracking-widest uppercase">
                          <tr>
                            <th className="px-4 py-3.5">ملاحظات وخطة التنفيذ / Description</th>
                            <th className="px-4 py-3.5">الأهمية / Priority</th>
                            <th className="px-4 py-3.5">السعر التقديري / Price</th>
                            <th className="px-4 py-3.5">التصنيف / Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E3DF] text-xs">
                          {analysisData?.budgetBreakdown.map((b, i) => (
                            <tr key={i} className="hover:bg-[#FAF9F5]/50 transition duration-150">
                              <td className="px-4 py-3 text-right">
                                <span className="font-bold text-[#1C1C1C] block">{b.item}</span>
                                <span className="text-[10px] text-[#8A867E] block mt-0.5">{b.notes}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full ${
                                  b.priority.toLowerCase() === 'high' 
                                    ? 'bg-red-50 text-red-700 border border-red-200' 
                                    : b.priority.toLowerCase() === 'medium'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-zinc-100 text-zinc-700'
                                }`}>
                                  {b.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-[#1C1C1C]">
                                {b.estimatedPrice.toLocaleString()} {currency}
                              </td>
                              <td className="px-4 py-3 text-[#6E6B64] font-bold font-semibold">
                                {b.category}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Highlights regarding local DIY solutions */}
                  <div className="bg-[#FAF9F5] border border-[#E5E3DF] rounded-xl p-4 space-y-1.5 text-right direction-rtl">
                    <span className="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-wider block">💡 حيلة لتوفير 30% من النفقات بمصر:</span>
                    <p className="text-xs text-[#6E6B64] leading-relaxed">
                      "يمكن استبدال عروض شركات المقاولات بالاتفاق مع نقاش محلي لشراء براميل طلاء Jotun Fenomastic من أقرب مستودع معتمد وبذلك تضمن مطابقة الكود اللوني الموصى به برُبع تكاليف الاستعانة بمهندس خارجي."
                    </p>
                  </div>
                </div>
              )}

              {/* Output Tab Body 4: Shopping Lists */}
              {activeTab === 'shopping' && (
                <div id="tab-pane-shopping" className="bg-white border border-[#E5E3DF] rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#1C1C1C]">ترشيحات الأثاث والديكور للشراء العاجل بمصر والمنطقة</h3>
                      <p className="text-[11px] text-[#8A867E]">قطع أثاث حقيقية متطابقة مع أبعاد وميزانية فراغك المعماري الجديد</p>
                    </div>
                    <ShoppingBag className="w-5 h-5 text-amber-700" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysisData?.shoppingSuggestions.map((item, idx) => (
                      <div 
                        key={idx} 
                        id={`shop-card-${idx}`}
                        className="bg-white border border-[#E5E3DF] hover:border-[#1C1C1C] text-right direction-rtl p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="bg-[#FAF9F5] border border-[#EBEBE8] text-[9px] font-bold px-2 py-0.5 rounded text-[#2E2C26]">
                              {item.store}
                            </span>
                            <span className="text-xs font-bold text-[#1C1C1C]">{item.name}</span>
                          </div>
                          <p className="text-[11px] text-[#6E6B64] leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#FAF9F5] pt-3 mt-1">
                          <div className="text-left font-mono font-bold text-sm text-[#1C1C1C]">
                            {item.estimatedPrice.toLocaleString()} {currency}
                          </div>
                          
                          <a 
                            href={item.url === '#' ? 'https://www.ikea.com/eg' : item.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#1C1C1C] hover:bg-amber-700 text-[#FFF] hover:text-[#FFF] rounded px-3 py-1 text-[10px] font-bold flex items-center gap-1 transition duration-150"
                          >
                            <span>تسوق القطعة / Shop</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shopping integration warning / notes */}
                  <div className="bg-[#FAF9F5] border border-amber-200 rounded-xl p-4 text-[11px] text-[#8A867E] leading-relaxed flex gap-2 text-right direction-rtl">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p>
                      <strong>ملاحظة للمستخدم:</strong> ينصح دائماً بمراجعة الفروع المحلية لـ IKEA بمصر (طريق الاسماعيلية أو مول مصر) أو متاجر هومزمارت للتأكد من المقاسات الحية قبل حجز دفعات التوصيل.
                    </p>
                  </div>
                </div>
              )}

              {/* Output Tab Body 5: Touch-AR Mode Simulator */}
              {activeTab === 'ar' && (
                <div id="tab-pane-ar" className="bg-white border border-[#E5E3DF] rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#1C1C1C] flex items-center gap-1.5">
                      <Grid className="w-5 h-5 text-amber-700" />
                      <span>تجربة الفراغ بالواقع المعزز المعملي / Touch-AR Laboratory Simulator</span>
                    </h3>
                    <p className="text-[11px] text-[#8A867E]">
                      محاكاة تفاعلية لوضع الأثاث الجديد فوق كاميرا الموبايل لتقدير المقاييس الحقيقية.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sandbox active workspace stage */}
                    <div className="md:col-span-3 space-y-2">
                      <div 
                        id="ar-simulation-camera-stage"
                        onMouseMove={handleArMouseMove}
                        onMouseUp={handleArMouseUp}
                        className="relative w-full aspect-video bg-[#1C1C1C] rounded-2xl overflow-hidden select-none shadow-md border border-[#E5E3DF]"
                      >
                        {/* Camera feedback simulated using original Room image as background */}
                        <img 
                          src={originalImageUrl} 
                          alt="Ambient Space Video backdrop" 
                          className="absolute inset-0 w-full h-full object-cover opacity-45"
                          referrerPolicy="no-referrer"
                        />

                        {/* Interactive Grid lines representing floor coordinates */}
                        <div className="absolute inset-0 bg-[#E5E3DF]/5 [background-image:linear-gradient(to_right,#E5E3DF_1px,transparent_1px),linear-gradient(to_bottom,#E5E3DF_1px,transparent_1px)] [background-size:40px_40px]"></div>

                        {/* Translucent overlay instructions */}
                        <div className="absolute left-3 top-3 bg-black/60 backdrop-blur text-white font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                          CAMERA STREAM: ACTIVE MOCK INTERFACE (AR MODE)
                        </div>

                        {/* Dynamic Floating Drag-able AR Items */}
                        {arItems.map((item) => {
                          const isSelected = selectedArItemId === item.id;
                          return (
                            <div
                              key={item.id}
                              id={`ar-stage-item-${item.id}`}
                              onMouseDown={(e) => handleArMouseDown(item.id, e)}
                              className={`absolute cursor-grab transition-shadow p-2 rounded-xl group/ar ${
                                isSelected 
                                  ? 'ring-2 ring-amber-400 bg-white/95 scale-105 z-30 shadow-2xl' 
                                  : 'bg-white/80 backdrop-blur-sm border border-[#E5E3DF] z-20 shadow-lg'
                              }`}
                              style={{ 
                                left: `${item.x}px`, 
                                top: `${item.y}px`,
                                transform: `translate(-50%, -50%) rotate(${item.r}deg)`,
                                width: `${100 * item.s}px`
                              }}
                            >
                              <div className="relative">
                                <img 
                                  src={item.src} 
                                  alt={item.label}
                                  className="w-full h-16 object-cover rounded-lg pointer-events-none select-none"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[7px] font-bold px-1 py-0.5 rounded">
                                  {item.label} (x{item.s})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#8A867E]">
                        <span>Drag items around screen using cursor or touch</span>
                        <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#E5E3DF] px-2 py-0.5 rounded text-[#2E2C25]">
                          <Camera className="w-3 h-3 text-amber-700" />
                          <span>Simulating front lens scan overlay</span>
                        </div>
                      </div>
                    </div>

                    {/* Left/Right AR tools sidebar */}
                    <div className="space-y-4">
                      {selectedArItemId ? (
                        <div className="bg-[#FAF9F5] border border-[#1C1C1C] rounded-xl p-4 space-y-3">
                          <span className="text-[9px] uppercase font-mono text-[#8A867E] block">تحكم في مقاييس الأثاث الذكي:</span>
                          
                          {/* Active properties */}
                          {(() => {
                            const act = arItems.find(it => it.id === selectedArItemId);
                            if (!act) return null;
                            return (
                              <div className="space-y-2 text-right">
                                <h4 className="text-xs font-bold text-[#1C1C1C]">{act.label}</h4>
                                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#E5E3DF]">
                                  <button
                                    type="button"
                                    onClick={() => rotateArItem(selectedArItemId)}
                                    className="bg-white border hover:bg-[#EBE9E3] text-[10px] font-bold py-1.5 rounded-lg border-[#E5E3DF]"
                                  >
                                    تدوير 45° / Rotate
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => scaleArItem(selectedArItemId, 0.1)}
                                    className="bg-white border hover:bg-[#EBE9E3] text-[10px] font-bold py-1.5 rounded-lg border-[#E5E3DF]"
                                  >
                                    تكبير الحجم / Scale +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => scaleArItem(selectedArItemId, -0.1)}
                                    className="bg-white border hover:bg-[#EBE9E3] text-[10px] font-bold py-1.5 rounded-lg border-[#E5E3DF] col-span-2"
                                  >
                                    تصغير الحجم / Scale -
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="bg-[#FAF9F5] border border-[#E5E3DF] p-4 rounded-xl text-center text-xs text-[#8A867E]">
                          اضغط على الكرسي أو المصباح داخل المحاكي لتنشيط عصا تدوير وتكبير مقاسات الفراغ.
                        </div>
                      )}

                      <div className="bg-[#FFFFFF] border border-[#E5E3DF] rounded-xl p-3.5 space-y-2 text-right direction-rtl">
                        <span className="text-[10px] font-bold text-[#1C1C1C] block uppercase">مفتاح الرموز:</span>
                        <p className="text-[10px] text-[#6E6B64] leading-relaxed">
                          - المقاس (Scale) يجب ضبطه بما يتوافق مع عموديّة الحائط الحقيقي لتجنب ظهور قطع الأثاث بأبعاد مشوهة.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </main>

      {/* Pristine Architectural Footer */}
      <footer id="studio-footer" className="bg-[#FFFFFF] border-t border-[#E5E3DF] mt-16 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-xs text-[#8A867E] flex items-center justify-center gap-1">
            <span>حقوق الملكية الفكرية محفوظة لشركة Alcove Studio © 2026</span>
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-mono text-[#6D6B65]">
            <span className="hover:underline cursor-pointer">Security Code Audit Checked</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Bilingual Arabic-English UI</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Creative Portfolio Standard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
