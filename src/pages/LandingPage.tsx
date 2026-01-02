import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { 
  Camera, Image, Users, CheckCircle, Zap, Shield, TrendingUp, 
  Clock, Award, ChevronRight, Play, 
  Upload, Eye, Download, Sparkles, Heart, Briefcase, Baby, 
  Home, Palette, Globe, Check, X, Twitter, Instagram, Facebook, Linkedin,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 }
  };

  const fadeInUpWithDelay = {
    initial: { opacity: 0, y: 40 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1 }
    })
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <SEO
        title="Polaris - Plataforma para Fotógrafos Profissionais | Galerias de Fotos Online"
        description="Transforme suas fotos do Google Drive em galerias profissionais com marca d'água. Gestão completa de projetos fotográficos, seleção online de clientes e entrega automatizada. Gratuito para começar!"
        keywords="fotografia profissional, galeria de fotos online, google drive integração, seleção de fotos, fotógrafo, gestão de projetos, marca d'água, clientes, portfólio fotográfico, casamento, ensaio, evento"
        url="/"
        image="/og-landing.jpg"
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header - Navbar melhorada */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800"
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3 group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <Camera className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" strokeWidth={2} />
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Polaris
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                Recursos
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                Como Funciona
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                Preços
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                Depoimentos
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hidden sm:inline text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium"
              >
                Entrar
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-primary text-white rounded-full hover:shadow-lg hover:shadow-primary/50 transition-all font-semibold flex items-center gap-2"
                >
                  Começar Grátis
                  <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </Link>
              </motion.div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Recursos
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Como Funciona
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Preços
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Depoimentos
              </a>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-center"
                >
                  Começar Grátis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Melhorado */}
      <section className="relative container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-32">
        {/* Background decorativo */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8 border border-primary/20"
          >
            <Award className="w-4 h-4 text-primary" strokeWidth={2} />
            <span className="text-sm font-semibold text-primary">Plataforma #1 para Fotógrafos</span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-[1.1]"
          >
            Galerias que
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Impressionam
            </span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Transforme suas fotos do Google Drive em galerias profissionais com marca d'água.
            <br className="hidden md:block" />
            Seus clientes escolhem, você entrega. <strong>Simples assim.</strong>
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="group px-8 py-4 bg-primary text-white rounded-full hover:shadow-2xl hover:shadow-primary/50 transition-all text-lg font-bold flex items-center gap-2"
              >
                Começar Gratuitamente
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-full hover:border-primary transition-all text-lg font-bold flex items-center gap-2"
            >
              <Play className="w-5 h-5" strokeWidth={2} fill="currentColor" />
              Ver Demo
            </motion.button>
          </motion.div>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            ✨ Sem cartão de crédito • 🚀 Pronto em 2 minutos • 🎨 100% gratuito para começar
          </motion.p>
        </div>

        {/* Hero Image melhorada */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto border border-gray-200 dark:border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1400&h=700&fit=crop&q=80"
              alt="Professional Photography Gallery"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Floating cards de exemplo */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-8 left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold">15 Fotos Selecionadas</p>
                  <p className="text-xs text-gray-500">por Maria Silva</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold">250+ Fotos</p>
                  <p className="text-xs text-gray-500">Sincronizadas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Logos Section - Social Proof */}
      <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-12 uppercase tracking-wider">
            Confiado por +1000 Fotógrafos Profissionais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-60 hover:opacity-80 transition-opacity">
            {[
              { name: 'Studio Luz', width: 'w-32' },
              { name: 'Momentos Foto', width: 'w-40' },
              { name: 'Click Perfeito', width: 'w-36' },
              { name: 'Foco Visual', width: 'w-32' },
              { name: 'Captura Pro', width: 'w-36' }
            ].map((brand, i) => (
              <div key={i} className={`${brand.width} h-12 flex items-center justify-center`}>
                <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 font-display">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Melhorado */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="text-sm font-semibold text-primary">Recursos Poderosos</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-bold mb-6">
              Tudo que você precisa
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ferramentas profissionais pensadas para fotógrafos modernos que valorizam seu tempo
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Upload,
                title: 'Sincronização Automática',
                description: 'Cole o link da pasta do Google Drive e pronto. Todas as fotos são sincronizadas automaticamente.',
                color: 'blue'
              },
              {
                icon: Eye,
                title: 'Marca D\'água Inteligente',
                description: 'Suas fotos ficam protegidas com resolução reduzida. Apenas você controla as originais.',
                color: 'purple'
              },
              {
                icon: Users,
                title: 'Seleção do Cliente',
                description: 'Seus clientes escolhem as fotos do pacote diretamente na galeria. Sem WhatsApp, sem confusão.',
                color: 'green'
              },
              {
                icon: Download,
                title: 'Download Simplificado',
                description: 'Baixe todas as fotos selecionadas em um único arquivo ZIP. Rápido e prático.',
                color: 'orange'
              },
              {
                icon: Shield,
                title: '100% Seguro',
                description: 'Seus arquivos continuam no Google Drive. Nós apenas criamos links seguros.',
                color: 'red'
              },
              {
                icon: Clock,
                title: 'Economize Tempo',
                description: 'Pare de enviar fotos por WhatsApp ou WeTransfer. Automatize todo o processo.',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="text-sm font-semibold text-primary">Processo Simplificado</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-bold mb-6">
              Como Funciona
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Em 3 passos simples, suas galerias estarão prontas para impressionar
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Cole o Link do Drive',
                description: 'Organize suas fotos em uma pasta do Google Drive e cole o link no Polaris.',
                icon: Upload
              },
              {
                step: '02',
                title: 'Compartilhe a Galeria',
                description: 'Copie o link da galeria e envie para seu cliente. Simples e profissional.',
                icon: Image
              },
              {
                step: '03',
                title: 'Receba as Seleções',
                description: 'Seu cliente escolhe as fotos e você recebe a seleção automaticamente.',
                icon: CheckCircle
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
                
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-6 shadow-lg shadow-primary/50">
                  {step.step}
                </div>
                
                <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-primary" strokeWidth={2} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="text-sm font-semibold text-primary">Para Todos os Tipos de Fotografia</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-bold mb-6">
              Perfeito para seu nicho
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Seja qual for sua especialidade, o Polaris se adapta ao seu fluxo de trabalho
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Heart,
                title: 'Casamentos',
                description: 'Entregue centenas de fotos de forma organizada. Seus noivos escolhem as favoritas para o álbum.',
                color: 'rose',
                gradient: 'from-rose-500 to-pink-500'
              },
              {
                icon: Briefcase,
                title: 'Corporativo',
                description: 'Headshots, eventos empresariais e fotos de equipe com seleção profissional e rápida.',
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Baby,
                title: 'Ensaios Infantis',
                description: 'Pais escolhem as fotos mais especiais dos pequenos de forma simples e intuitiva.',
                color: 'amber',
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                icon: Home,
                title: 'Fotografia de Produto',
                description: 'Clientes comerciais selecionam as melhores imagens para seus catálogos e e-commerce.',
                color: 'emerald',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Palette,
                title: 'Ensaios Criativos',
                description: 'Portfolios, books de moda e sessões artísticas com apresentação premium.',
                color: 'purple',
                gradient: 'from-purple-500 to-indigo-500'
              },
              {
                icon: Globe,
                title: 'Eventos Sociais',
                description: 'Formaturas, aniversários e festas. Muitos convidados, uma única galeria.',
                color: 'cyan',
                gradient: 'from-cyan-500 to-blue-500'
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all p-8"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-${useCase.color}-100 dark:bg-${useCase.color}-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <useCase.icon className={`w-8 h-8 text-${useCase.color}-600 dark:text-${useCase.color}-400`} strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <Award className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="text-sm font-semibold text-primary">Planos Simples e Transparentes</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-bold mb-6">
              Escolha seu plano
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comece grátis e evolua conforme seu negócio cresce
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-8 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-gray-600 dark:text-gray-400">/mês</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Para começar a testar</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Até 3 projetos ativos',
                  'Até 100 fotos por projeto',
                  'Marca d\'água automática',
                  'Seleção de clientes',
                  'Suporte por email'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                {[
                  'Download ZIP de seleções',
                  'Projetos ilimitados',
                  'Personalização de marca'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 opacity-50">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-gray-500 dark:text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="block w-full px-6 py-3.5 text-center border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all font-semibold"
              >
                Começar Grátis
              </Link>
            </motion.div>

            {/* Pro Plan - Destacado */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white transform scale-105 shadow-2xl"
            >
              <div className="absolute top-4 right-4 bg-white text-primary px-3 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">R$ 49</span>
                  <span className="text-white/80">/mês</span>
                </div>
                <p className="text-white/90">Para fotógrafos profissionais</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Projetos ilimitados',
                  'Fotos ilimitadas',
                  'Marca d\'água automática',
                  'Seleção de clientes',
                  'Download ZIP de seleções',
                  'Personalização de marca',
                  'Domínio personalizado',
                  'Suporte prioritário'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="block w-full px-6 py-3.5 text-center bg-white text-primary rounded-xl hover:bg-white/90 transition-all font-semibold shadow-lg"
              >
                Começar Teste Grátis
              </Link>
              <p className="text-center text-white/80 text-sm mt-4">14 dias grátis, cancele quando quiser</p>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 p-8 hover:border-primary hover:shadow-xl transition-all"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">Custom</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Para estúdios e agências</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Tudo do Professional',
                  'Múltiplos usuários',
                  'API de integração',
                  'Relatórios avançados',
                  'White label completo',
                  'Gerente de conta dedicado',
                  'SLA garantido',
                  'Treinamento da equipe'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="block w-full px-6 py-3.5 text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all font-semibold">
                Falar com Vendas
              </button>
            </motion.div>
          </div>

          {/* Guarantee Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2} />
              <span className="text-green-900 dark:text-green-300 font-semibold">
                Garantia de 30 dias • Cancele quando quiser • Sem taxas ocultas
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90">
              Junte-se a mais de 1.000 fotógrafos que já simplificaram suas entregas
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary rounded-full hover:shadow-2xl transition-all text-xl font-bold"
              >
                Criar Conta Gratuita
                <ChevronRight className="w-6 h-6" strokeWidth={3} />
              </Link>
            </motion.div>

            <p className="mt-8 text-white/80">
              Sem cartão de crédito necessário • Comece em menos de 2 minutos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="w-8 h-8 text-primary" strokeWidth={2} />
                <span className="text-2xl font-display font-bold text-white">Polaris</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Galerias profissionais simplificadas para fotógrafos modernos.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-bold mb-4">Produto</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold mb-4">Empresa</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold mb-4">Recursos</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Polaris. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
