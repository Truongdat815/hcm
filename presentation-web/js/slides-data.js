// Dữ liệu toàn bộ 11 Slides trình chiếu được chuẩn hóa theo 4 Diễn giả (HẰN, VY, ĐẠT, THẢO)
const PRESENTATION_DATA = {
  theme: {
    title: "Sức mạnh dân tộc & Hợp tác quốc tế trong kỷ nguyên hội nhập",
    subject: "Tư tưởng Hồ Chí Minh về Đại đoàn kết dân tộc và Đoàn kết quốc tế",
    group: "Nhóm thuyết trình: Hằng • Vy • Đạt • Thảo"
  },
  sections: [
    {
      id: "part-1",
      speaker: "HẰN",
      role: "Mở đầu & Lý luận 1",
      allocatedTime: 210, // 3.5 phút = 210s
      label: "1. Mở đầu & Cơ sở biện chứng",
      slides: [
        {
          id: "slide-1-1",
          partId: "part-1",
          partNumber: "PHẦN 1",
          speaker: "HẰN",
          slideNum: "Slide 1.1",
          title: "Sức mạnh dân tộc trong kỷ nguyên hội nhập",
          subTitle: "Độc lập tự chủ vs. Hợp tác đa phương: Xung đột hay Cộng hưởng?",
          tag: "BỐI CẢNH THẾ GIỚI BIẾN ĐỘNG",
          hook: "Biên giới mềm mỏng – Lợi ích đan xen",
          type: "hero-split",
          content: {
            bulletPoints: [
              {
                title: "Thách thức thời đại",
                desc: "Thế giới biến chuyển không ngừng, toàn cầu hóa đan xen với cạnh tranh địa chính trị gay gắt."
              },
              {
                title: "Bài toán sinh tồn",
                desc: "Đóng cửa thì tụt hậu và tự đào thải; mở cửa lỏng lẻo thì nguy cơ xói mòn độc lập, chủ quyền."
              },
              {
                title: "Câu hỏi cốt lõi",
                desc: "Hợp tác quốc tế có bào mòn lợi ích dân tộc không, hay là chiếc đòn bẩy nhân bội nội lực quốc gia?"
              }
            ],
            badge: "Câu hỏi nghiên cứu trọng tâm",
            highlightBox: "« Nhìn vào bản đồ thế giới hôm nay: Độc lập và Hội nhập không loại trừ nhau, mà tạo nên thế chân kiềng của quốc gia hiện đại. »"
          },
          imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Bản đồ kết nối các mắt xích toàn cầu trong kỷ nguyên đa cực",
          script: "Chào thầy/cô và các bạn. Nhìn vào bản đồ thế giới hôm nay, quốc gia nào đóng cửa là tụt hậu, nhưng mở cửa lỏng lẻo là mất độc lập. Câu hỏi cốt lõi mà nhóm muốn đặt ra ngay từ đầu: Hợp tác quốc tế có bào mòn lợi ích dân tộc không, hay chính là chiếc đòn bẩy nhân bội lực lượng của chúng ta trong kỷ nguyên mới?"
        },
        {
          id: "slide-1-2",
          partId: "part-1",
          partNumber: "PHẦN 1",
          speaker: "HẰN",
          slideNum: "Slide 1.2",
          title: "Mối quan hệ biện chứng: Lợi ích dân tộc & Hợp tác quốc tế",
          subTitle: "Nguyên tắc vàng: « Dĩ bất biến, ứng vạn biến » trong ngoại giao",
          tag: "QUY LUẬT BIỆN CHỨNG",
          hook: "Lợi ích dân tộc là neo tàu – Hợp tác quốc tế là gió đẩy",
          type: "dual-concept",
          content: {
            leftCard: {
              title: "LỢI ÍCH DÂN TỘC",
              role: "Mục tiêu tối thượng – Lõi bất biến",
              icon: "⚓",
              points: [
                "Độc lập dân tộc, chủ quyền quốc gia vững chắc",
                "Toàn vẹn lãnh thổ đất liền, vùng trời và biển đảo",
                "Phồn vinh và hạnh phúc bền vững của nhân dân",
                "Giữ vững bản sắc và an ninh chế độ chính trị"
              ]
            },
            rightCard: {
              title: "HỢP TÁC QUỐC TẾ",
              role: "Phương thức & Động lực – Dòng chảy vạn biến",
              icon: "🌐",
              points: [
                "Mở rộng thị trường xuất nhập khẩu & thu hút FDI",
                "Chuyển giao khoa học, công nghệ cao & AI",
                "Ngoại giao đa phương củng cố vị thế chiến lược",
                "Hội nhập sâu rộng vào chuỗi giá trị toàn cầu"
              ]
            },
            equation: {
              text: "Hợp tác để phục vụ Độc lập — Độc lập để nâng tầm Hợp tác",
              rule: "Phương châm Hồ Chí Minh: « Dĩ bất biến, ứng vạn biến »"
            }
          },
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Bánh răng tương hỗ giữa nền móng nội lực và cánh cửa hội nhập",
          script: "Thưa thầy cô và các bạn, mối quan hệ giữa hai yếu tố này có thể hình dung qua hình ảnh: Lợi ích dân tộc là chiếc neo tàu, còn Hợp tác quốc tế là luồng gió đẩy. Gió to đến mấy mà không có neo vững thì bão tố cuốn trôi; nhưng nếu neo quá chặt mà không chịu giương buồm đón gió thì con tàu mãi mãi đứng im một chỗ."
        },
        {
          id: "slide-1-3",
          partId: "part-1",
          partNumber: "PHẦN 1",
          speaker: "HẰN",
          slideNum: "Slide 1.3",
          title: "Sự cần thiết & Lực lượng đoàn kết quốc tế",
          subTitle: "Hóa giải thách thức phi truyền thống bằng sức mạnh liên minh",
          tag: "TẤT YẾU KHÁCH QUAN",
          hook: "Không quốc gia nào có thể đơn độc đối mặt bài toán toàn cầu",
          type: "grid-cards",
          content: {
            whyTitle: "VÌ SAO ĐOÀN KẾT LÀ TẤT YẾU?",
            whyPoints: [
              "An ninh phi truyền thống: Biến đổi khí hậu, khủng hoảng an ninh mạng, dịch bệnh toàn cầu.",
              "Chuỗi cung ứng toàn cầu đòi hỏi sự tương thuộc và chia sẻ rủi ro giữa các đối tác.",
              "Quản trị các công nghệ đột phá (AI Governance, năng lượng xanh, bán dẫn)."
            ],
            forcesTitle: "LỰC LƯỢNG ĐOÀN KẾT CHIẾN LƯỢC",
            forcesList: [
              { name: "Phong trào Hòa bình & Tiến bộ", detail: "Nhân dân yêu chuộng công lý, luật pháp quốc tế trên toàn thế giới." },
              { name: "Cộng đồng các nước đang phát triển", detail: "Hợp tác Nam - Nam, bảo vệ lợi ích bình đẳng trong thương mại." },
              { name: "Khối ASEAN", detail: "Mái nhà chung khu vực, xây dựng cộng đồng gắn kết và tự cường." },
              { name: "Đối tác chiến lược toàn diện", detail: "Mạng lưới bạn bè và các cường quốc cùng chia sẻ tầm nhìn phát triển." }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Hội nghị thượng đỉnh ngoại giao đa phương củng cố sự đoàn kết",
          script: "Không một quốc gia đơn lẻ nào – dù giàu mạnh đến đâu – có thể tự mình giải quyết bài toán AI governance, đứt gãy chuỗi cung ứng hay biến đổi khí hậu. Đoàn kết quốc tế không chỉ là bắt tay xã giao, mà chính là mở rộng đồng minh chiến lược để bảo vệ đất nước từ sớm, từ xa."
        }
      ]
    },
    {
      id: "part-2",
      speaker: "VY",
      role: "Lý luận 2",
      allocatedTime: 240, // 4 phút = 240s
      label: "2. Tư tưởng Hồ Chí Minh & Quy luật kết hợp",
      slides: [
        {
          id: "slide-2-1",
          partId: "part-2",
          partNumber: "PHẦN 2",
          speaker: "VY",
          slideNum: "Slide 2.1",
          title: "3 Nguyên tắc đoàn kết quốc tế",
          subTitle: "Hệ thống nguyên lý trường tồn trong Tư tưởng Hồ Chí Minh",
          tag: "NGUYÊN TẮC CỐT LÕI",
          hook: "Đoàn kết không phải thủ thuật tình thế, mà là đạo lý gắn liền thực tiễn",
          type: "principles-triad",
          content: {
            principles: [
              {
                num: "01",
                badge: "TỰ LỰC CÁNH SINH",
                title: "Độc lập tự chủ gắn liền đoàn kết quốc tế",
                desc: "Muốn người ta giúp mình thì trước hết mình phải tự giúp lấy mình. Nội lực mạnh thì ngoại viện mới phát huy tác dụng."
              },
              {
                num: "02",
                badge: "BÌNH ĐẲNG WIN-WIN",
                title: "Cùng có lợi, tôn trọng chủ quyền",
                desc: "Hợp tác trên cơ sở bình đẳng, tôn trọng độc lập, chủ quyền và toàn vẹn lãnh thổ; tuyệt đối không can thiệp vào công việc nội bộ."
              },
              {
                num: "03",
                badge: "TÂM THÀNH THỦY CHUNG",
                title: "Thủy chung, trong sáng với bạn bè tiến bộ",
                desc: "Tình nghĩa quốc tế trước sau như một, có trách nhiệm với các vấn đề hòa bình, giải phóng con người và công lý toàn cầu."
              }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Ấn bản văn kiện nghiên cứu tư tưởng và triết lý Hồ Chí Minh",
          script: "Tiếp nối phần của bạn Hằng, Tư tưởng Hồ Chí Minh khẳng định: Đoàn kết quốc tế không bao giờ là thủ thuật ngoại giao tình thế, mà là một đạo lý cách mạng nhất quán. Ba nguyên tắc vàng này chính là kim chỉ nam giúp dân tộc ta đứng vững qua mọi phong ba bão táp của lịch sử."
        },
        {
          id: "slide-2-2",
          partId: "part-2",
          partNumber: "PHẦN 2",
          speaker: "VY",
          slideNum: "Slide 2.2",
          title: "Trích dẫn chuẩn xác từ Hồ Chí Minh Toàn tập",
          subTitle: "Lời dạy lịch sử soi sáng tư duy ngoại giao hiện đại",
          tag: "VĂN KIỆN LỊCH SỬ LƯU TRỮ",
          hook: "Giúp bạn là tự củng cố biên độ an ninh mềm cho chính mình",
          type: "historical-quotes",
          content: {
            quotes: [
              {
                quote: "« Giúp bạn là tự giúp mình »",
                source: "Hồ Chí Minh Toàn tập, Tập 12, trang 472",
                analysis: "Giúp đỡ bạn bè quốc tế vượt qua gian khó không phải là sự ban phát hay tốn kém đơn chiều, mà chính là cách xây dựng phên dậu hòa bình, an ninh và tình cảm tin cậy vững chắc nhất cho Tổ quốc."
              },
              {
                quote: "« Đoàn kết, đoàn kết, đại đoàn kết.\nThành công, thành công, đại thành công! »",
                source: "Lời dạy bất hủ của Chủ tịch Hồ Chí Minh",
                analysis: "Công thức mở rộng sang bình diện quốc tế: Sức mạnh Việt Nam = Khối Đại đoàn kết toàn dân tộc (nền móng bên trong) + Khối Đại đoàn kết quốc tế (đòn bẩy bên ngoài)."
              }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1507842229346-7788701e360f?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Thư viện lưu trữ di sản văn kiện và tư tưởng cách mạng",
          script: "Đọc trong Hồ Chí Minh Toàn tập, Bác chỉ rõ: Lực lượng quốc tế tiến bộ chính là cánh tay tiếp sức cho nội lực Việt Nam. Tư tưởng 'Giúp bạn là tự giúp mình' mang tầm nhìn chiến lược vượt thời đại: Giúp bạn lúc khó khăn chính là củng cố biên an ninh mềm cho chính quốc gia của chúng ta."
        },
        {
          id: "slide-2-3",
          partId: "part-2",
          partNumber: "PHẦN 2",
          speaker: "VY",
          slideNum: "Slide 2.3",
          title: "Sự kết hợp Sức mạnh dân tộc và Sức mạnh thời đại",
          subTitle: "Quy luật tương tác giữa Nhân tố Quyết định & Nhân tố Đột phá",
          tag: "QUY LUẬT PHÁT TRIỂN",
          hook: "Biến ngọn gió thời đại thành bệ phóng cho con tàu dân tộc",
          type: "convergence-matrix",
          content: {
            internal: {
              label: "SỨC MẠNH DÂN TỘC (NỘI LỰC)",
              status: "NHÂN TỐ QUYẾT ĐỊNH HÀNG ĐẦU",
              items: [
                "Nội lực kinh tế, hạ tầng và tiềm lực tài chính quốc gia",
                "Văn hóa ngàn năm, truyền thống yêu nước và bản lĩnh quật cường",
                "Ý chí tự lực tự cường của 100 triệu người dân Việt Nam",
                "Lực lượng vũ trang tinh nhuệ, sẵn sàng bảo vệ chủ quyền"
              ]
            },
            external: {
              label: "SỨC MẠNH THỜI ĐẠI (NGOẠI LỰC)",
              status: "NHÂN TỐ QUAN TRỌNG, ĐỘT PHÁ",
              items: [
                "Xu thế lớn của nhân loại: Hòa bình, độc lập và phát triển",
                "Cách mạng khoa học công nghệ, Chuyển đổi số, Kỷ nguyên AI",
                "Phong trào dân chủ, bảo vệ môi trường và tiến bộ xã hội",
                "Nguồn vốn FDI, chuỗi cung ứng và tri thức toàn cầu"
              ]
            },
            conclusion: "« Thời đại có mang sóng thần công nghệ hay cơ hội toàn cầu đến đâu, nếu nền móng nội lực rỗng thì ngoại lực cũng xuyên thủng. Phải lấy nội lực làm gốc để biến thời đại thành bệ phóng! »"
          },
          imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Sóng hội tụ năng lượng: Khi nội lực vững chắc bắt nhịp với dòng chảy công nghệ",
          script: "Thời đại có mang sóng thần công nghệ hay cơ hội tỷ đô đến đâu, nếu nền móng nội lực rỗng thì ngoại lực cũng sẽ xuyên thủng hoặc bào mòn ta. Nội lực quyết định sự trường tồn, ngoại lực tạo sức bật đột phá. Muốn hội nhập thành công, ta phải luôn coi nội lực là gốc rễ."
        }
      ]
    },
    {
      id: "part-3",
      speaker: "ĐẠT",
      role: "Thực tiễn quốc gia",
      allocatedTime: 270, // 4.5 phút = 270s
      label: "3. Thực tiễn: Ngoại giao Cây tre & Ngoại giao Vắc-xin",
      slides: [
        {
          id: "slide-3-1",
          partId: "part-3",
          partNumber: "PHẦN 3",
          speaker: "ĐẠT",
          slideNum: "Slide 3.1",
          title: "Ngoại giao cây tre & Cục diện hội nhập Việt Nam",
          subTitle: "Bản sắc ngoại giao thời đại mới: « Gốc vững, thân chắc, cành uyển chuyển »",
          tag: "BỨC TRANH THỰC TIỄN",
          hook: "Việt Nam chơi với tất cả cường quốc nhưng không lệ thuộc vào bất kỳ bên nào",
          type: "bamboo-diplomacy",
          content: {
            philosophy: [
              { part: "GỐC VỮNG", desc: "Lợi ích quốc gia - dân tộc là bất biến; độc lập, tự chủ, kiên định con đường xã hội chủ nghĩa." },
              { part: "THÂN CHẮC", desc: "Bản lĩnh chính trị kiên cường; nội lực kinh tế tự cường; khối đại đoàn kết toàn dân bền vững." },
              { part: "CÀNH UYỂN CHUYỂN", desc: "Linh hoạt trong sách lược; đa phương hóa, đa dạng hóa; biến thù thành bạn, tìm điểm tương đồng." }
            ],
            metrics: [
              { value: "750 - 800+", unit: "Tỷ USD", label: "Kim ngạch xuất nhập khẩu vượt mốc ấn tượng, top 20 thương mại thế giới." },
              { value: "16+", unit: "FTA thế hệ mới", label: "Ký kết và thực thi các hiệp định tiêu chuẩn cao: EVFTA, CPTPP, RCEP..." },
              { value: "5/5", unit: "Nước Thường trực", label: "Thiết lập Đối tác chiến lược toàn diện / Đối tác chiến lược với cả 5 nước P5 HĐBA LHQ." }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Mạng lưới kết nối đối tác ngoại giao đa phương của Việt Nam trên bản đồ toàn cầu",
          script: "Xin chào thầy cô và các bạn, tôi là Đạt. Trường phái 'Ngoại giao Cây tre' do Tổng Bí thư Nguyễn Phú Trọng đúc kết: Gốc vững, thân chắc, cành mềm mại. Việt Nam ngày nay chơi với tất cả các cường quốc nhưng kiên quyết không chọn bên, không để bị lôi kéo. Nhờ vậy, kim ngạch ngoại thương vượt mốc 750-800 tỷ USD – thuộc top đầu thế giới so với quy mô nền kinh tế."
        },
        {
          id: "slide-3-2",
          partId: "part-3",
          partNumber: "PHẦN 3",
          speaker: "ĐẠT",
          slideNum: "Slide 3.2",
          title: "Case Study: Chiến dịch « Ngoại giao vắc-xin COVID-19 » (2021-2022)",
          subTitle: "Đỉnh cao của sự kết hợp: Ý chí lãnh đạo, Uy tín chính trị & Tình nghĩa quốc tế",
          tag: "MINH CHỨNG THỰC TIỄN KINH ĐIỂN",
          hook: "Cuộc chạy đua sinh tử xuyên biên giới vì an ninh con người",
          type: "case-study-vaccine",
          content: {
            context: "Khủng hoảng y tế toàn cầu trầm trọng, biến chủng Delta bùng phát, chuỗi cung ứng vắc-xin khan hiếm khốc liệt và bất bình đẳng giữa các nước.",
            actions: [
              "Hơn 100 cuộc điện đàm, tiếp xúc, thư tín cấp cao của Tổng Bí thư, Chủ tịch nước, Thủ tướng, Chủ tịch Quốc hội.",
              "Chiến lược ngoại giao đa - song phương thần tốc: Cơ chế COVAX + Vận động trực tiếp Mỹ, Nhật Bản, Trung Quốc, Nga, Úc, các nước EU, Cuba...",
              "Kết hợp nhịp nhàng giữa Ngoại giao Đảng, Ngoại giao Nhà nước và Đối ngoại nhân dân xuyên đêm."
            ],
            results: "Tiếp cận hơn 210+ triệu liều vắc-xin (phần lớn qua viện trợ/hỗ trợ giá ưu đãi); đưa Việt Nam từ nước thiếu hụt vươn lên top đầu thế giới về tỷ lệ bao phủ tiêm chủng, tạo tiền đề mở cửa kinh tế an toàn vào quý 1/2022.",
            lessons: [
              { title: "Bài học 1: Uy tín chính trị là tài sản vô giá", detail: "Trước đó Việt Nam viện trợ khẩu trang cho bạn bè quốc tế; khi ta gặp nạn, bạn bè toàn tâm chung sức." },
              { title: "Bài học 2: Đa phương hóa linh hoạt", detail: "Không trông chờ một nguồn duy nhất, kết hợp COVAX lẫn song phương với mọi cực quyền lực." },
              { title: "Bài học 3: An ninh con người là trung tâm", detail: "Tính mạng và sức khỏe nhân dân là ưu tiên số một, là động lực cao nhất cho mọi hành động ngoại giao." }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d099ab?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Các chuyến bay viện trợ và logistics vận chuyển vắc-xin khẩn cấp hạ cánh an toàn",
          script: "Ngoại giao vắc-xin chính là ví dụ sống động nhất của việc kết hợp nội lực và ngoại lực. Khi dịch bệnh đe dọa sinh mệnh nhân dân, lãnh đạo cấp cao của ta đã điện đàm xuyên đêm với nguyên thủ khắp năm châu. Từng chiếc khẩu trang ta tặng bạn khi bạn khó khăn, nay trở thành hàng chục triệu liều vắc-xin bạn viện trợ lại cho ta. Đó chính là 'Giúp bạn là tự giúp mình'!"
        }
      ]
    },
    {
      id: "part-4",
      speaker: "THẢO",
      role: "Bài học kinh nghiệm & Kết luận",
      allocatedTime: 180, // 3 phút = 180s
      label: "4. Bài học, Năng lực sinh viên & Kết luận",
      slides: [
        {
          id: "slide-4-1",
          partId: "part-4",
          partNumber: "PHẦN 4",
          speaker: "THẢO",
          slideNum: "Slide 4.1",
          title: "Bài học quản trị quốc gia & xã hội",
          subTitle: "Từ chiến lược phòng vệ sang tư duy kiến tạo phát triển bền vững",
          tag: "TỔNG KẾT QUẢN TRỊ",
          hook: "Lòng dân chính là liều « vắc-xin tinh thần » vững chãi nhất",
          type: "governance-lessons",
          content: {
            cards: [
              {
                icon: "🛡️",
                title: "Quản trị rủi ro từ sớm, từ xa",
                desc: "Không đợi khủng hoảng bùng phát mới tìm kiếm giải pháp. Luôn xây dựng kịch bản dự phòng cho an ninh lương thực, năng lượng, chuỗi cung ứng và y tế."
              },
              {
                icon: "🌐",
                title: "Độc lập tự chủ ≠ Tự cô lập",
                desc: "Độc lập không có nghĩa là khép kín tự cung tự cấp. Độc lập thực sự là có năng lực tự quyết định vận mệnh của mình ngay giữa lòng hội nhập toàn cầu."
              },
              {
                icon: "❤️",
                title: "Đồng thuận xã hội là nền tảng",
                desc: "Mọi quyết sách ngoại giao chỉ phát huy sức mạnh khi có sự đồng lòng của nhân dân. Sự tin tưởng của nhân dân là hậu phương vững chắc nhất cho ngoại giao nhà nước."
              }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Bầu trời đô thị hiện đại và năng động của TP. Hồ Chí Minh trong kỷ nguyên chuyển mình",
          script: "Chào thầy cô và các bạn, tôi là Thảo. Bài học quản trị lớn nhất rút ra là: Đừng đợi sóng gió đến mới bắt đầu gia cố mạn thuyền. Một chính sách ngoại giao chỉ có thể thành công khi bắt nguồn từ sự đồng thuận xã hội. Niềm tin và sự đoàn kết của người dân chính là liều vắc-xin tinh thần mạnh mẽ nhất bảo vệ quốc gia."
        },
        {
          id: "slide-4-2",
          partId: "part-4",
          partNumber: "PHẦN 4",
          speaker: "THẢO",
          slideNum: "Slide 4.2",
          title: "Năng lực hội nhập của sinh viên kỷ nguyên số & AI",
          subTitle: "3 Trụ cột hành trang của thế hệ công dân toàn cầu mang tâm hồn Việt",
          tag: "HÀNH TRANG THẾ HỆ TRẺ",
          hook: "Ngồi tại Việt Nam – Tư duy và kết nối toàn cầu",
          type: "student-pillars",
          content: {
            pillars: [
              {
                num: "01",
                badge: "GỐC RỄ BẢN SẮC",
                title: "Bản sắc văn hóa dân tộc",
                desc: "Hòa nhập mà không hòa tan. Hiểu sâu sắc mình là ai, yêu truyền thống lịch sử nước nhà để không bị cuốn trôi giữa biển thông tin đa văn hóa."
              },
              {
                num: "02",
                badge: "CÔNG CỤ THỜI ĐẠI",
                title: "Năng lực số & Xuyên văn hóa",
                desc: "Làm chủ AI, ngoại ngữ, kỹ năng làm việc từ xa (remote collaboration) và khả năng thấu cảm, tôn trọng sự đa dạng trong môi trường quốc tế."
              },
              {
                num: "03",
                badge: "TÂM THẾ TỰ CƯỜNG",
                title: "Tư duy thích ứng (Adaptability)",
                desc: "Chủ động học tập suốt đời, biến biến động thành cơ hội. Đồng sáng tạo giá trị thay vì đối kháng hay lo sợ trước làn sóng tự động hóa."
              }
            ]
          },
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Sinh viên và giới trẻ cùng hợp tác, thảo luận trong không gian sáng tạo quốc tế",
          script: "Sinh viên chúng ta hôm nay có thể ngồi tại giảng đường Việt Nam nhưng cùng làm việc, viết code với đồng nghiệp trên khắp năm châu. Hội nhập không có nghĩa là đánh mất bản thân, mà là tự tin mang giá trị độc bản của người trẻ Việt Nam ra đóng góp cho thế giới."
        },
        {
          id: "slide-4-3",
          partId: "part-4",
          partNumber: "PHẦN 4",
          speaker: "THẢO",
          slideNum: "Slide 4.3",
          title: "Kết luận & Thông điệp truyền cảm hứng",
          subTitle: "Vươn mình vào kỷ nguyên mới với tâm thế tự tin và chủ động",
          tag: "THÔNG ĐIỆP BẾ MẠC",
          hook: "Đứng vững trên đôi chân của mình để bắt tay cùng cả thế giới",
          type: "grand-finale",
          content: {
            mainQuote: "« Độc lập dân tộc không phải là đóng rào giậu kín mít,\nmà là đứng vững trên đôi chân của chính mình để tự tin bắt tay cùng toàn cầu. »",
            author: "Thông điệp đúc kết từ nhóm nghiên cứu",
            callToAction: "Cảm ơn Thầy Cô và các Bạn đã lắng nghe!\nNhóm chúng em sẵn sàng đón nhận câu hỏi & cùng thảo luận.",
            qaButtonText: "Mở diễn đàn trao đổi (Q&A)"
          },
          imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
          imageCaption: "Ánh bình minh chiếu rọi đường chân trời: Khởi đầu cho những chân trời hợp tác mới",
          script: "Xin được khép lại bài thuyết trình bằng một đúc kết: Độc lập dân tộc không phải là đóng rào giậu, mà là đứng vững trên đôi chân để bắt tay toàn cầu. Thay mặt nhóm, xin chân thành cảm ơn Thầy/Cô và các bạn đã chú ý lắng nghe. Nhóm chúng em rất mong nhận được những câu hỏi và ý kiến đóng góp quý báu!"
        }
      ]
    }
  ]
};
