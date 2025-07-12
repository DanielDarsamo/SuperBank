export const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    next: 'Next',
    back: 'Back',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    phoneNumber: 'Phone Number',
    enterPin: 'Enter PIN',
    createPin: 'Create PIN',
    confirmPin: 'Confirm PIN',
    otpCode: 'Verification Code',
    sendOtp: 'Send Code',
    verifyOtp: 'Verify Code',
    
    // Account Opening
    accountOpening: 'Account Opening',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    idNumber: 'ID Number',
    nuit: 'NUIT',
    uploadId: 'Upload ID Document',
    uploadIncome: 'Upload Income Document',
    applicationSubmitted: 'Application Submitted',
    applicationPending: 'Application Pending',
    applicationApproved: 'Application Approved',
    applicationRejected: 'Application Rejected',
    
    // Queue Management
    queueManagement: 'Queue Management',
    joinQueue: 'Join Queue',
    selectBranch: 'Select Branch',
    selectService: 'Select Service',
    queueNumber: 'Queue Number',
    estimatedWait: 'Estimated Wait Time',
    currentStatus: 'Current Status',
    waiting: 'Waiting',
    called: 'Called',
    beingServed: 'Being Served',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Banking Services
    bankingServices: 'Banking Services',
    checkBalance: 'Check Balance',
    transfer: 'Transfer Money',
    payBills: 'Pay Bills',
    accountBalance: 'Account Balance',
    transferAmount: 'Transfer Amount',
    recipientAccount: 'Recipient Account',
    billType: 'Bill Type',
    
    // FAQ
    faq: 'Frequently Asked Questions',
    searchFaq: 'Search FAQ',
    contactSupport: 'Contact Support',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    manageAccounts: 'Manage Accounts',
    manageQueues: 'Manage Queues',
    approveApplication: 'Approve Application',
    rejectApplication: 'Reject Application',
    totalApplications: 'Total Applications',
    pendingApplications: 'Pending Applications',
    activeQueues: 'Active Queues',
  },
  pt: {
    // Common
    welcome: 'Bem-vindo',
    loading: 'Carregando...',
    submit: 'Enviar',
    cancel: 'Cancelar',
    next: 'Próximo',
    back: 'Voltar',
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    
    // Auth
    login: 'Entrar',
    logout: 'Sair',
    register: 'Registrar',
    phoneNumber: 'Número de Telefone',
    enterPin: 'Digite o PIN',
    createPin: 'Criar PIN',
    confirmPin: 'Confirmar PIN',
    otpCode: 'Código de Verificação',
    sendOtp: 'Enviar Código',
    verifyOtp: 'Verificar Código',
    
    // Account Opening
    accountOpening: 'Abertura de Conta',
    personalInfo: 'Informações Pessoais',
    fullName: 'Nome Completo',
    idNumber: 'Número do ID',
    nuit: 'NUIT',
    uploadId: 'Carregar Documento de ID',
    uploadIncome: 'Carregar Comprovante de Renda',
    applicationSubmitted: 'Aplicação Enviada',
    applicationPending: 'Aplicação Pendente',
    applicationApproved: 'Aplicação Aprovada',
    applicationRejected: 'Aplicação Rejeitada',
    
    // Queue Management
    queueManagement: 'Gestão de Filas',
    joinQueue: 'Entrar na Fila',
    selectBranch: 'Selecionar Agência',
    selectService: 'Selecionar Serviço',
    queueNumber: 'Número da Fila',
    estimatedWait: 'Tempo Estimado de Espera',
    currentStatus: 'Status Atual',
    waiting: 'Aguardando',
    called: 'Chamado',
    beingServed: 'Sendo Atendido',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    
    // Banking Services
    bankingServices: 'Serviços Bancários',
    checkBalance: 'Verificar Saldo',
    transfer: 'Transferir Dinheiro',
    payBills: 'Pagar Contas',
    accountBalance: 'Saldo da Conta',
    transferAmount: 'Valor da Transferência',
    recipientAccount: 'Conta do Destinatário',
    billType: 'Tipo de Conta',
    
    // FAQ
    faq: 'Perguntas Frequentes',
    searchFaq: 'Pesquisar FAQ',
    contactSupport: 'Contatar Suporte',
    
    // Admin
    adminDashboard: 'Painel Administrativo',
    manageAccounts: 'Gerenciar Contas',
    manageQueues: 'Gerenciar Filas',
    approveApplication: 'Aprovar Aplicação',
    rejectApplication: 'Rejeitar Aplicação',
    totalApplications: 'Total de Aplicações',
    pendingApplications: 'Aplicações Pendentes',
    activeQueues: 'Filas Ativas',
  },
};

export const useTranslation = (language: 'en' | 'pt') => {
  return {
    t: (key: keyof typeof translations.en) => translations[language][key] || key,
  };
};