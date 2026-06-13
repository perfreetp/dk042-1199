import type {
  Requirement,
  Evaluation,
  RdCommunication,
  Followup,
  Timeline,
  Hospital,
  Department,
  Device,
  User,
  DashboardStats,
  DeviceStat,
  DeadlineItem,
} from '../types';

export const hospitals: Hospital[] = [
  { id: 'h1', name: '北京协和医院' },
  { id: 'h2', name: '上海瑞金医院' },
  { id: 'h3', name: '广州中山医院' },
  { id: 'h4', name: '华西医院' },
  { id: 'h5', name: '武汉同济医院' },
];

export const departments: Department[] = [
  { id: 'd1', name: '心内科', hospitalId: 'h1' },
  { id: 'd2', name: '放射科', hospitalId: 'h1' },
  { id: 'd3', name: '检验科', hospitalId: 'h1' },
  { id: 'd4', name: '心内科', hospitalId: 'h2' },
  { id: 'd5', name: '放射科', hospitalId: 'h2' },
  { id: 'd6', name: '手术室', hospitalId: 'h2' },
  { id: 'd7', name: 'ICU', hospitalId: 'h3' },
  { id: 'd8', name: '放射科', hospitalId: 'h3' },
  { id: 'd9', name: '检验科', hospitalId: 'h4' },
  { id: 'd10', name: '心内科', hospitalId: 'h5' },
];

export const devices: Device[] = [
  { id: 'dev1', model: 'CT-3000 螺旋CT' },
  { id: 'dev2', model: 'MRI-5000 磁共振' },
  { id: 'dev3', model: 'ECG-200 心电图机' },
  { id: 'dev4', model: 'US-800 超声诊断仪' },
  { id: 'dev5', model: 'ANA-1000 生化分析仪' },
  { id: 'dev6', model: 'VENT-200 呼吸机' },
  { id: 'dev7', model: 'MON-500 监护仪' },
  { id: 'dev8', model: 'DR-300 数字X光机' },
];

export const users: User[] = [
  { id: 'u1', name: '张工', role: '售后工程师', department: '售后服务部' },
  { id: 'u2', name: '李工', role: '售后工程师', department: '售后服务部' },
  { id: 'u3', name: '王经理', role: '产品经理', department: '产品部' },
  { id: 'u4', name: '刘经理', role: '产品经理', department: '产品部' },
  { id: 'u5', name: '陈研发', role: '研发工程师', department: '研发一部' },
  { id: 'u6', name: '赵研发', role: '研发工程师', department: '研发二部' },
  { id: 'u7', name: '孙客服', role: '客服专员', department: '客户服务部' },
  { id: 'u8', name: '周客服', role: '客服专员', department: '客户服务部' },
];

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const daysLater = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const requirements: Requirement[] = [
  {
    id: 'req1',
    reqNo: 'REQ-2026-0001',
    hospital: '北京协和医院',
    department: '放射科',
    deviceModel: 'CT-3000 螺旋CT',
    deviceSn: 'CT202400123',
    submitter: '张工',
    submitTime: daysAgo(5),
    title: 'CT扫描图像出现伪影',
    description: '患者在进行胸部CT扫描时，图像中出现周期性条状伪影，影响诊断结果。已尝试重启设备和校准，但问题仍然存在。',
    category: 'fault',
    status: 'processing',
    priority: 'critical',
    impactLevel: 'severe',
    customerExpectation: '希望能在一周内解决问题，否则需要安排备用设备',
    repairRecord: '2026-06-10 现场检修，更换了X射线管组件，伪影有所减轻但未完全消除。',
    photos: ['photo1.jpg', 'photo2.jpg'],
    assignee: '陈研发',
    assigneeDept: '研发一部',
    targetVersion: 'V2.3.1',
    promiseDate: daysLater(3),
    responseDeadline: daysAgo(3),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    id: 'req2',
    reqNo: 'REQ-2026-0002',
    hospital: '上海瑞金医院',
    department: '心内科',
    deviceModel: 'ECG-200 心电图机',
    deviceSn: 'ECG202500456',
    submitter: '李工',
    submitTime: daysAgo(3),
    title: '心电图机数据导出格式优化',
    description: '医院希望心电图机能够直接导出HL7标准格式，方便接入医院信息系统。目前只能导出PDF，需要人工录入。',
    category: 'experience',
    status: 'evaluating',
    priority: 'high',
    impactLevel: 'significant',
    customerExpectation: '希望在下个版本中增加此功能',
    repairRecord: '无',
    photos: [],
    assignee: null,
    assigneeDept: null,
    targetVersion: null,
    promiseDate: null,
    responseDeadline: daysAgo(1),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: 'req3',
    reqNo: 'REQ-2026-0003',
    hospital: '广州中山医院',
    department: 'ICU',
    deviceModel: 'VENT-200 呼吸机',
    deviceSn: 'VENT202500789',
    submitter: '张工',
    submitTime: daysAgo(7),
    title: '呼吸机需要符合新的YY标准',
    description: '国家药监局发布了新的呼吸设备安全标准YY 9706.212-2023，要求所有呼吸机在2026年底前完成合规更新。',
    category: 'compliance',
    status: 'processing',
    priority: 'critical',
    impactLevel: 'severe',
    customerExpectation: '请提供合规更新时间表和具体方案',
    repairRecord: '无',
    photos: [],
    assignee: '赵研发',
    assigneeDept: '研发二部',
    targetVersion: 'V3.0.0',
    promiseDate: daysLater(30),
    responseDeadline: daysAgo(5),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
  },
  {
    id: 'req4',
    reqNo: 'REQ-2026-0004',
    hospital: '华西医院',
    department: '检验科',
    deviceModel: 'ANA-1000 生化分析仪',
    deviceSn: 'ANA202400234',
    submitter: '李工',
    submitTime: daysAgo(2),
    title: '生化分析仪操作培训需求',
    description: '检验科新入职3名检验技师，需要进行生化分析仪的操作培训，包括日常维护、常见故障处理等内容。',
    category: 'training',
    status: 'followup',
    priority: 'medium',
    impactLevel: 'moderate',
    customerExpectation: '希望能安排线下培训，时间灵活安排',
    repairRecord: '无',
    photos: [],
    assignee: '孙客服',
    assigneeDept: '客户服务部',
    targetVersion: null,
    promiseDate: daysLater(7),
    responseDeadline: daysLater(1),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: 'req5',
    reqNo: 'REQ-2026-0005',
    hospital: '武汉同济医院',
    department: '心内科',
    deviceModel: 'US-800 超声诊断仪',
    deviceSn: 'US202500567',
    submitter: '张工',
    submitTime: daysAgo(10),
    title: '超声图像存储容量不足',
    description: '随着检查量增加，超声诊断仪的本地存储空间经常不足，需要频繁手动删除旧数据，希望能增加自动归档功能。',
    category: 'experience',
    status: 'closed',
    priority: 'medium',
    impactLevel: 'moderate',
    customerExpectation: '已完成软件升级，支持自动上传到PACS系统',
    repairRecord: '2026-06-05 已完成软件升级V2.2.0',
    photos: [],
    assignee: '陈研发',
    assigneeDept: '研发一部',
    targetVersion: 'V2.2.0',
    promiseDate: daysAgo(3),
    responseDeadline: daysAgo(8),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
  },
  {
    id: 'req6',
    reqNo: 'REQ-2026-0006',
    hospital: '北京协和医院',
    department: '心内科',
    deviceModel: 'MON-500 监护仪',
    deviceSn: 'MON202500111',
    submitter: '李工',
    submitTime: daysAgo(1),
    title: '监护仪报警阈值设置不合理',
    description: '临床反映监护仪的心率报警阈值范围太窄，经常出现误报警，干扰正常工作。希望能够自定义各参数的报警范围。',
    category: 'fault',
    status: 'pending',
    priority: null,
    impactLevel: 'significant',
    customerExpectation: '希望能尽快评估并给出解决方案',
    repairRecord: '无',
    photos: [],
    assignee: null,
    assigneeDept: null,
    targetVersion: null,
    promiseDate: null,
    responseDeadline: daysLater(1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'req7',
    reqNo: 'REQ-2026-0007',
    hospital: '上海瑞金医院',
    department: '手术室',
    deviceModel: 'DR-300 数字X光机',
    deviceSn: 'DR202400888',
    submitter: '张工',
    submitTime: daysAgo(4),
    title: 'X光机图像清晰度优化',
    description: '手术室中的X光机在拍摄移动患者时，图像容易模糊。希望能优化运动补偿算法，提高图像质量。',
    category: 'experience',
    status: 'evaluating',
    priority: 'high',
    impactLevel: 'significant',
    customerExpectation: '希望能在3个月内提供优化方案',
    repairRecord: '2026-06-12 现场调试参数，效果有限',
    photos: ['photo3.jpg'],
    assignee: null,
    assigneeDept: null,
    targetVersion: null,
    promiseDate: null,
    responseDeadline: daysLater(1),
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    id: 'req8',
    reqNo: 'REQ-2026-0008',
    hospital: '广州中山医院',
    department: '放射科',
    deviceModel: 'MRI-5000 磁共振',
    deviceSn: 'MRI202300001',
    submitter: '李工',
    submitTime: daysAgo(15),
    title: '磁共振线圈接口接触不良',
    description: '设备使用3年多，近期头部线圈连接时经常报错，需要多次插拔才能识别。怀疑是接口磨损导致。',
    category: 'fault',
    status: 'processing',
    priority: 'high',
    impactLevel: 'significant',
    customerExpectation: '希望能更换接口组件，并提供预防性维护建议',
    repairRecord: '2026-06-01 清洁接口，临时解决；2026-06-08 问题复发',
    photos: ['photo4.jpg', 'photo5.jpg'],
    assignee: '赵研发',
    assigneeDept: '研发二部',
    targetVersion: 'V2.1.0',
    promiseDate: daysLater(5),
    responseDeadline: daysAgo(13),
    createdAt: daysAgo(15),
    updatedAt: daysAgo(6),
  },
  {
    id: 'req9',
    reqNo: 'REQ-2026-0009',
    hospital: '北京协和医院',
    department: '检验科',
    deviceModel: 'ANA-1000 生化分析仪',
    deviceSn: 'ANA202400235',
    submitter: '张工',
    submitTime: daysAgo(20),
    title: '生化分析仪LIS通讯中断',
    description: '设备与LIS系统通讯时经常中断，导致检验结果无法自动上传，需要人工补录，严重影响工作效率。',
    category: 'fault',
    status: 'closed',
    priority: 'critical',
    impactLevel: 'severe',
    customerExpectation: '已解决，更换了网卡并升级了通讯固件',
    repairRecord: '2026-05-28 更换网卡；2026-06-02 升级固件V1.5.0；2026-06-05 验证通过',
    photos: [],
    assignee: '陈研发',
    assigneeDept: '研发一部',
    targetVersion: 'V1.5.0',
    promiseDate: daysAgo(10),
    responseDeadline: daysAgo(18),
    createdAt: daysAgo(20),
    updatedAt: daysAgo(9),
  },
  {
    id: 'req10',
    reqNo: 'REQ-2026-0010',
    hospital: '上海瑞金医院',
    department: '放射科',
    deviceModel: 'CT-3000 螺旋CT',
    deviceSn: 'CT202400124',
    submitter: '李工',
    submitTime: daysAgo(6),
    title: 'CT辐射剂量报告自动生成',
    description: '医院评审要求提供每例CT检查的辐射剂量报告，目前需要手动记录，希望设备能够自动生成并导出。',
    category: 'compliance',
    status: 'evaluating',
    priority: 'high',
    impactLevel: 'significant',
    customerExpectation: '希望能在下季度评审前完成',
    repairRecord: '无',
    photos: [],
    assignee: null,
    assigneeDept: null,
    targetVersion: null,
    promiseDate: null,
    responseDeadline: daysAgo(4),
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
  },
];

export const evaluations: Evaluation[] = [
  {
    id: 'eval1',
    requirementId: 'req1',
    category: 'fault',
    impactScope: 5,
    urgency: 5,
    difficulty: 4,
    businessValue: 5,
    priority: 'critical',
    assignee: '陈研发',
    assigneeDept: '研发一部',
    targetVersion: 'V2.3.1',
    promiseDate: daysLater(3),
    evaluator: '王经理',
    evaluateTime: daysAgo(4),
    remarks: '该问题影响多个科室，患者投诉较多，需优先处理。建议硬件和软件团队联合排查。',
  },
  {
    id: 'eval3',
    requirementId: 'req3',
    category: 'compliance',
    impactScope: 5,
    urgency: 5,
    difficulty: 5,
    businessValue: 5,
    priority: 'critical',
    assignee: '赵研发',
    assigneeDept: '研发二部',
    targetVersion: 'V3.0.0',
    promiseDate: daysLater(30),
    evaluator: '刘经理',
    evaluateTime: daysAgo(6),
    remarks: '合规性要求，涉及所有在售呼吸机型号，需要成立专项小组。',
  },
  {
    id: 'eval5',
    requirementId: 'req5',
    category: 'experience',
    impactScope: 3,
    urgency: 3,
    difficulty: 2,
    businessValue: 4,
    priority: 'medium',
    assignee: '陈研发',
    assigneeDept: '研发一部',
    targetVersion: 'V2.2.0',
    promiseDate: daysAgo(3),
    evaluator: '王经理',
    evaluateTime: daysAgo(9),
    remarks: '已有PACS接口，只需增加自动触发逻辑。',
  },
  {
    id: 'eval8',
    requirementId: 'req8',
    category: 'fault',
    impactScope: 4,
    urgency: 4,
    difficulty: 3,
    businessValue: 4,
    priority: 'high',
    assignee: '赵研发',
    assigneeDept: '研发二部',
    targetVersion: 'V2.1.0',
    promiseDate: daysLater(5),
    evaluator: '刘经理',
    evaluateTime: daysAgo(14),
    remarks: '属于设计磨损问题，需要改进接口设计，同时考虑已售设备的改造方案。',
  },
  {
    id: 'eval9',
    requirementId: 'req9',
    category: 'fault',
    impactScope: 5,
    urgency: 5,
    difficulty: 3,
    businessValue: 5,
    priority: 'critical',
    assignee: '陈研发',
    assigneeDept: '研发一部',
    targetVersion: 'V1.5.0',
    promiseDate: daysAgo(10),
    evaluator: '王经理',
    evaluateTime: daysAgo(19),
    remarks: '通讯问题严重影响检验科工作，需要立即排查。',
  },
];

export const rdCommunications: RdCommunication[] = [
  {
    id: 'rd1',
    requirementId: 'req1',
    responder: '陈研发',
    responseTime: daysAgo(3),
    content: '经过分析，伪影问题是由于探测器模块温度漂移导致。我们已开发了新的温度补偿算法，初步测试显示伪影减少了85%。需要安排现场验证。',
    feasibility: 'feasible',
    workLoad: '2人周',
    riskAssessment: '低风险，算法改动不影响其他功能',
    alternatives: [
      {
        id: 'alt1',
        name: '软件升级方案',
        description: '通过软件算法补偿温度漂移',
        advantages: '成本低，升级方便，无需拆机',
        disadvantages: '极端温度环境下效果可能有限',
      },
      {
        id: 'alt2',
        name: '硬件改进方案',
        description: '增加探测器散热模块和温度传感器',
        advantages: '从根本上解决问题，效果稳定',
        disadvantages: '需要拆机，成本较高，周期长',
      },
    ],
  },
  {
    id: 'rd3',
    requirementId: 'req3',
    responder: '赵研发',
    responseTime: daysAgo(5),
    content: '已完成新标准YY 9706.212-2023的解读，主要涉及报警系统、呼吸回路安全和电磁兼容性三个方面。我们已制定详细的升级方案，需要分阶段实施。',
    feasibility: 'feasible',
    workLoad: '10人月',
    riskAssessment: '中风险，涉及硬件和软件的多处改动，需要充分测试',
    alternatives: [
      {
        id: 'alt3',
        name: '全面升级方案',
        description: '按照新标准进行全面设计验证',
        advantages: '一次性满足所有合规要求',
        disadvantages: '周期长，成本高',
      },
      {
        id: 'alt4',
        name: '分阶段升级方案',
        description: '先完成高风险项，后续逐步完善',
        advantages: '能快速响应监管要求，风险可控',
        disadvantages: '需要多次升级',
      },
    ],
  },
  {
    id: 'rd8',
    requirementId: 'req8',
    responder: '赵研发',
    responseTime: daysAgo(7),
    content: '经分析，接口接触不良是由于连接器镀层磨损导致。我们已设计了新的加强型连接器，插拔次数可从5000次提升到20000次。',
    feasibility: 'feasible',
    workLoad: '3人周',
    riskAssessment: '低风险，仅更换连接器组件',
    alternatives: [
      {
        id: 'alt5',
        name: '更换改进型连接器',
        description: '使用新设计的加强型连接器',
        advantages: '从根本解决问题，提高可靠性',
        disadvantages: '需要拆机更换，有物料成本',
      },
      {
        id: 'alt6',
        name: '清洁维护方案',
        description: '定期清洁连接器接触面',
        advantages: '成本低，操作简单',
        disadvantages: '治标不治本，需要定期维护',
      },
    ],
  },
];

export const followups: Followup[] = [
  {
    id: 'f1',
    requirementId: 'req1',
    followupTime: daysAgo(2),
    followupType: 'phone',
    contactPerson: '李主任',
    content: '已向客户沟通研发进展，说明正在开发温度补偿算法，预计3天后可以提供测试版本。',
    customerFeedback: '客户表示理解，希望能尽快安排现场测试。',
    nextFollowupTime: daysLater(2),
    operator: '孙客服',
    createdAt: daysAgo(2),
  },
  {
    id: 'f2',
    requirementId: 'req2',
    followupTime: daysAgo(1),
    followupType: 'onsite',
    contactPerson: '王技师',
    content: '上门了解具体需求，客户详细说明了HL7格式要求和信息系统对接方式。',
    customerFeedback: '客户非常配合，提供了详细的接口文档。',
    nextFollowupTime: daysLater(5),
    operator: '周客服',
    createdAt: daysAgo(1),
  },
  {
    id: 'f3',
    requirementId: 'req3',
    followupTime: daysAgo(4),
    followupType: 'email',
    contactPerson: '陈主任',
    content: '已通过邮件发送合规更新计划和时间表，客户正在评估中。',
    customerFeedback: '客户回复将在本周内给出反馈。',
    nextFollowupTime: daysLater(1),
    operator: '孙客服',
    createdAt: daysAgo(4),
  },
  {
    id: 'f4',
    requirementId: 'req4',
    followupTime: daysAgo(1),
    followupType: 'phone',
    contactPerson: '刘护士长',
    content: '与客户确认培训时间，初步定在下周二下午。',
    customerFeedback: '客户确认时间可行，希望培训材料能提前发送。',
    nextFollowupTime: daysLater(5),
    operator: '周客服',
    createdAt: daysAgo(1),
  },
  {
    id: 'f5',
    requirementId: 'req5',
    followupTime: daysAgo(3),
    followupType: 'onsite',
    contactPerson: '张主任',
    content: '现场验证软件升级效果，自动归档功能运行正常。',
    customerFeedback: '客户非常满意，问题已完全解决。',
    nextFollowupTime: null,
    operator: '孙客服',
    createdAt: daysAgo(3),
  },
  {
    id: 'f6',
    requirementId: 'req9',
    followupTime: daysAgo(8),
    followupType: 'phone',
    contactPerson: '王主任',
    content: '电话回访确认问题解决情况，客户表示通讯稳定，没有再出现中断问题。',
    customerFeedback: '客户对处理速度和结果都很满意。',
    nextFollowupTime: null,
    operator: '周客服',
    createdAt: daysAgo(8),
  },
];

export const timelines: Timeline[] = [
  { id: 't1', requirementId: 'req1', type: 'create', operator: '张工', time: daysAgo(5), content: '提交需求' },
  { id: 't2', requirementId: 'req1', type: 'evaluate', operator: '王经理', time: daysAgo(4), content: '评估完成，优先级：紧急' },
  { id: 't3', requirementId: 'req1', type: 'status-change', operator: '系统', time: daysAgo(4), content: '状态变更：待评估 → 处理中' },
  { id: 't4', requirementId: 'req1', type: 'rd-reply', operator: '陈研发', time: daysAgo(3), content: '研发答复：温度补偿算法开发中' },
  { id: 't5', requirementId: 'req1', type: 'followup', operator: '孙客服', time: daysAgo(2), content: '客户跟进：电话沟通进展' },
  { id: 't6', requirementId: 'req2', type: 'create', operator: '李工', time: daysAgo(3), content: '提交需求' },
  { id: 't7', requirementId: 'req2', type: 'followup', operator: '周客服', time: daysAgo(1), content: '客户跟进：现场调研需求' },
  { id: 't8', requirementId: 'req3', type: 'create', operator: '张工', time: daysAgo(7), content: '提交需求' },
  { id: 't9', requirementId: 'req3', type: 'evaluate', operator: '刘经理', time: daysAgo(6), content: '评估完成，优先级：紧急' },
  { id: 't10', requirementId: 'req3', type: 'status-change', operator: '系统', time: daysAgo(6), content: '状态变更：待评估 → 处理中' },
  { id: 't11', requirementId: 'req3', type: 'rd-reply', operator: '赵研发', time: daysAgo(5), content: '研发答复：已完成标准解读和方案设计' },
  { id: 't12', requirementId: 'req3', type: 'followup', operator: '孙客服', time: daysAgo(4), content: '客户跟进：邮件发送升级计划' },
];

export const getDashboardStats = (): DashboardStats => {
  const total = requirements.length;
  const pending = requirements.filter(r => r.status === 'pending' || r.status === 'evaluating').length;
  const processing = requirements.filter(r => r.status === 'processing' || r.status === 'followup').length;
  const closed = requirements.filter(r => r.status === 'closed').length;
  const avgCycleDays = 12.5;

  return { total, pending, processing, closed, avgCycleDays };
};

export const getTopDevices = (): DeviceStat[] => {
  const deviceCount: Record<string, number> = {};
  requirements.forEach(r => {
    deviceCount[r.deviceModel] = (deviceCount[r.deviceModel] || 0) + 1;
  });
  return Object.entries(deviceCount)
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};

export const getPendingRequirements = (): Requirement[] => {
  return requirements.filter(r => {
    const deadline = new Date(r.responseDeadline);
    const now = new Date();
    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours < 48 && r.status !== 'closed';
  }).sort((a, b) => new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime());
};

export const getDeadlines = (): DeadlineItem[] => {
  return requirements
    .filter(r => r.promiseDate && r.status !== 'closed')
    .map(r => {
      const deadline = new Date(r.promiseDate!);
      const now = new Date();
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: r.id,
        reqNo: r.reqNo,
        title: r.title,
        hospital: r.hospital,
        deadline: r.promiseDate!,
        daysLeft,
        isOverdue: daysLeft < 0,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

export const getRequirementById = (id: string): Requirement | undefined => {
  return requirements.find(r => r.id === id);
};

export const getEvaluationByRequirementId = (requirementId: string): Evaluation | undefined => {
  return evaluations.find(e => e.requirementId === requirementId);
};

export const getRdCommunicationsByRequirementId = (requirementId: string): RdCommunication[] => {
  return rdCommunications.filter(rd => rd.requirementId === requirementId);
};

export const getFollowupsByRequirementId = (requirementId: string): Followup[] => {
  return followups.filter(f => f.requirementId === requirementId).sort((a, b) => 
    new Date(b.followupTime).getTime() - new Date(a.followupTime).getTime()
  );
};

export const getTimelineByRequirementId = (requirementId: string): Timeline[] => {
  return timelines.filter(t => t.requirementId === requirementId).sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
};
