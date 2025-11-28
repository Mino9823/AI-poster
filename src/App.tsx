import React, { useState, useEffect, useRef } from "react"; 
import styled from "styled-components";
import iconSrc from './assets/icon.png';

const ALL_PRESETS = [
    "AI 포스터",
    "종이 배경",
    "AI 감성 배경"
];
const PRESETS_TO_DISPLAY = 3;

const backgroundStyleMap: { [key: string]: string } = {
  "AI 포스터": "poster",
  "종이 배경": "paper",
  "AI 감성 배경": "emotional",
};

const QuotePosterPage: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [fontStyle, setFontStyle] = useState("고딕");
    const [startIndex, setStartIndex] = useState(0);
      const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [apiResponse, setApiResponse] = useState<any | null>(null);
        const [selectedBackgroundPreset, setSelectedBackgroundPreset] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex(prevIndex => (prevIndex + 1) % ALL_PRESETS.length);
    }, 8000); 
        return () => clearInterval(timer);
      }, []);
    
      useEffect(() => {
        if (apiResponse && resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, [apiResponse]);
    
      const presets = (() => {
        const endIndex = startIndex + PRESETS_TO_DISPLAY;
    
        if (endIndex <= ALL_PRESETS.length) {
          return ALL_PRESETS.slice(startIndex, endIndex);
        } else {
          const part1 = ALL_PRESETS.slice(startIndex);
          const part2 = ALL_PRESETS.slice(0, endIndex - ALL_PRESETS.length);
          return [...part1, ...part2];
        }
      })();
    
      const fontOptions = ["손글씨", "붓글씨", "고딕"];
    
      const handlePresetClick = (text: string) => {
        setSelectedBackgroundPreset(text);
      };
    
      const handleOptionClick = (style: string) => {
        setFontStyle(style);
        setShowOptions(false);
        console.log("Selected Font:", style);
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setApiResponse(null);
    
        // API 주소 정의
        const API_URL = 'http://133.186.223.103:8000/sns/api/generate-calligraphy' // 👈 실제 API 엔드포인트에 맞게 경로를 수정하세요.
    
        // 1. FormData 객체 생성
        const formData = new FormData();
        formData.append('mode', "calligraphy");
        formData.append('topic', topic);
        formData.append('fontStyle', fontStyle);
        const mappedBackgroundStyle = selectedBackgroundPreset
          ? backgroundStyleMap[selectedBackgroundPreset] || "poster"
          : "poster";
        formData.append('background_style', mappedBackgroundStyle);
        formData.append('font_size', '60');
        formData.append('text_color','255,255,255');
    
        // 2. 파일이 선택되었다면 FormData에 추가
        if (selectedFile) {
          // 'image'는 서버가 파일을 받을 때 사용할 필드 이름입니다. 서버 스펙에 맞게 변경하세요.
          formData.append('image', selectedFile, selectedFile.name);
        }
    
        // 3. fetch 요청 실행
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            // FormData 사용 시 Content-Type 헤더는 브라우저가 자동으로 설정합니다.
            body: formData,
          });
    
          if (!response.ok) {
            // 200-299 범위 외의 HTTP 상태 코드는 여기서 처리됩니다.
            throw new Error(`서버 응답 오류: ${response.status}`);
          }
    
          // 4. 서버 응답 처리 (예: JSON으로 응답을 받음)
          const result = await response.json();
          setApiResponse(result);
    
          console.log("명언 포스터 생성 성공:", result);
    
          // TODO: 성공 후 로직 추가 (예: UI 업데이트, 포스터 표시 등)
    
        } catch (error) {
          console.error("명언 포스터 생성 중 오류 발생:", error);
          alert("포스터 생성에 실패했습니다. API 주소나 서버 상태를 확인해 주세요.");
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <PageWrapper>
      <GradientBg />
      <Content>
      <IconCircle>
      {/* 2. import 한 변수명(iconSrc)을 src에 사용 */}
        <img 
          src={iconSrc} // 👈 import 된 변수 사용
          alt="AI 명언 포스터 생성기 아이콘" 
          style={{ width: '60%', height: '60%', objectFit: 'contain' }} 
        />
      </IconCircle>
        <Title>AI 명언 포스터 생성기</Title>
        <Subtitle>
          당신의 감정에 맞는 완벽한 명언을 찾아드립니다
        </Subtitle>

        <FormCard onSubmit={handleSubmit}>
          <InputWrapper>
          
            {showOptions && (
              <OptionMenu>
                {fontOptions.map((style) => (
                  <OptionItem 
                    key={style}
                    onClick={() => handleOptionClick(style)}
                    $isActive={fontStyle === style} 
                  >
                    {style}
                  </OptionItem>
                ))}
              </OptionMenu>
            )}
                <HiddenFileInput
                  id="file-upload"
                  type="file"
                  accept="image/*" // 이미지 파일만 허용
                  onChange={handleFileChange}
              />
            <TextInput
              value={topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
              placeholder="당신의 현재 상태나 감정을 말해보세요 (예: 힘들고 지칠 때)"
            />
            <PlusButton type="button" onClick={() => setShowOptions(!showOptions)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zM19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.74-1.71-.98L14.8 2.18c-.06-.25-.29-.4-.54-.4h-4c-.25 0-.48.15-.54.4L9.1 4.5c-.62.24-1.19.58-1.71.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.74 1.71.98l.37 2.32c.06.25.29.4.54.4h4c.25 0 .48-.15.54-.4l.37-2.32c.62-.24 1.19-.58 1.71-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
              </svg>
            </PlusButton>

                        <SubmitButton type="submit" disabled={isLoading}>
                          {isLoading ? <Spinner /> : "명언 생성"}
                        </SubmitButton>
                      </InputWrapper>
            
                    </FormCard>
            
                    <PresetList>
                        {/* 5. 동적으로 계산된 presets 사용 */}
                        {presets.map((item) => (
                          <PresetChip
                            type="button"
                            key={item}
                            onClick={() => handlePresetClick(item)}
                            $isSelected={selectedBackgroundPreset === item}
                          >
                            {item}
                          </PresetChip>
                        ))}
                      </PresetList>
            
                    <HelperText>
                      AI가 당신의 감정을 이해하고 맞춤형 명언을 만들어드립니다.
                    </HelperText>
            
                            {apiResponse && apiResponse.image && (
                              <ResultDisplay ref={resultRef}>                        <ResultImage src={`http://133.186.223.103:8000${apiResponse.image.path}`} alt="Generated Poster" />
                        <ResultText>명언: {apiResponse.quote}</ResultText>
                        <ResultText>주제: {apiResponse.topic}</ResultText>
                      </ResultDisplay>
                    )}
                  </Content>
                </PageWrapper>
              );
            };
            
            export default QuotePosterPage;
            
            /* ---------------- styled-components ---------------- */
            
            const Spinner = styled.div`
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top: 4px solid #ffffff;
              width: 20px;
              height: 20px;
              animation: spin 1s linear infinite;
            
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `;
            
            const ResultDisplay = styled.div`
              margin-top: 30px;
              padding: 20px;
              background: rgba(255, 255, 255, 0.92);
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
            `;
            
            const ResultImage = styled.img`
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            `;
            
            const ResultText = styled.p`
              font-size: 16px;
              color: #333;
              margin: 0;
            `;
            
            const PageWrapper = styled.div`
              position: relative;
              min-height: 100vh;
              width: 100%;
              overflow: hidden;
              background: #f5f7ff;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 40px 16px;
              box-sizing: border-box;
            `;
            
            const GradientBg = styled.div`
              position: absolute;
              inset: -20%;
            
              /* 👇 위에서 아래로 (to bottom) 방향으로, 중앙에만 하얀색을 집중 */
              background: linear-gradient(
                to bottom,
                #e1f0ff 0%,     /* 상단: 가장 연한 하늘색/흰색에 가까움 */
                #b3d7ff 30%,     /* 위쪽 중간: 밝은 하늘색 */
                #FFFFFF 45%,     /* 👈 정중앙 (45%): 순수 흰색으로 변경하여 하얗게 강조 */
                #b3d7ff 70%,     /* 아래쪽 중간: 밝은 하늘색 */
                #e1f0ff 100%     /* 하단: 가장 연한 하늘색/흰색에 가까움 */
              );
            
              /* 그라데이션 바깥 영역의 기본 배경색 */
              background-color: #e1f0ff; /* 가장 연한 하늘색으로 채움 */
            
              opacity: 1;
              pointer-events: none;
            `;
            
            const Content = styled.div`
              position: relative;
              max-width: 980px;
              width: 100%;
              text-align: center;
            `;
            
            const IconCircle = styled.div`
              margin: 0 auto 24px;
              width: 76px;
              height: 76px;
              border-radius: 999px;
              /* 💡 기존의 파란색 그라데이션 배경은 유지 */
              background: linear-gradient(135deg, #4a8bff, #7ec6ff);
            
              /* 👇 이미지 관련 배경 속성들은 제거합니다 (<img> 태그를 사용하므로) */
              /* background-image: url('/path/to/your/star-icon.png'); */
              /* background-size: 50%; */
              /* background-repeat: no-repeat; */
              /* background-position: center; */
            
              /* 내부 <img> 태그를 중앙에 배치하기 위해 Flexbox 유지 */
              display: flex;
              align-items: center;
              justify-content: center;
            
              /* font-size, color 등 텍스트 관련 속성은 필요 없으므로 제거 또는 주석 처리 */
              /* font-size: 34px; */
              /* color: white; */
              box-shadow: 0 18px 45px rgba(73, 123, 255, 0.45);
            `;
            
            const Title = styled.h1`
              font-size: 40px;
              font-weight: 800;
              color: #4A8BFF;
              letTer-spacing: 0.03em;
              margin-bottom: 8px;
            
              @media (max-width: 600px) {
                font-size: 32px;
              }
            `;
            
            const Subtitle = styled.p`
              font-size: 18px;
              color: #555b73;
              margin-bottom: 36px;
            
              @media (max-width: 600px) {
                font-size: 15px;
              }
            `;
            
            const FormCard = styled.form`
              background: rgba(255, 255, 255, 0.92);
              border-radius: 999px;
              padding: 18px 22px;
              box-shadow: 0 24px 60px rgba(96, 112, 255, 0.2);
              backdrop-filter: blur(18px);
              -webkit-backdrop-filter: blur(18px);
              border: 1px solid rgba(255, 255, 255, 0.8);
            
              display: flex;
              flex-direction: column;
              gap: 12px;
            
              @media (min-width: 768px) {
                border-radius: 999px;
                padding: 20px 26px;
              }
            `;
            
            const InputWrapper = styled.div`
              display: flex;
              align-items: center;
              gap: 14px;
            
              position: relative; /* 옵션 메뉴를 InputWrapper 기준으로 띄우기 위해 추가 */
            `;
            
            const PlusButton = styled.button`
              width: 38px;
              height: 38px;
              border-radius: 999px;
              border: none;
              background: #e8f0ff;
              color: #4b8fff;
              font-size: 24px;
              font-weight: 300;
              cursor: pointer;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background 0.2s;
            `;
            
            const HiddenFileInput = styled.input`
              display: none;
            `;
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const ImageUploadButton = styled.label`
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
            
              height: 38px; /* PlusButton과 동일한 높이 */
              padding: 0 12px;
              border-radius: 999px;
              border: none;
              font-size: 18px;
              font-weight: 500;
              cursor: pointer;
              flex-shrink: 0;
              transition: background 0.2s;
            
              &:hover {
                background: #d4e0ff;
              }
            `;
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const FileNameText = styled.span`
                font-size: 12px;
                color: #4b8fff;
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-left: 4px;
            `;
            
            const OptionMenu = styled.div`
              position: absolute;
              top: 100%; /* InputWrapper 바로 아래에 배치 */
              left: 0;
              z-index: 10;
              margin-top: 8px; /* InputWrapper와의 간격 */
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
              padding: 8px 0;
              min-width: 120px;
              text-align: left;
            `;
            
            const OptionItem = styled.button<{ $isActive?: boolean }>`
              width: 100%;
              padding: 8px 12px;
              background: ${({ $isActive }) => ($isActive ? "#e8f0ff" : "transparent")};
              border: none;
              text-align: left;
              cursor: pointer;
              color: #233;
              font-size: 14px;
              transition: background 0.12s ease;
            
              &:hover {
                background: #d4e0ff;
              }
            `;
            
            const TextInput = styled.input`
              flex: 1;
              border: none;
              outline: none;
              background: transparent;
              font-size: 18px;
              padding: 10px 0;
              color: #333333;
            
              &::placeholder {
                color: #b3b8d1;
              }
            `;
            
            const SubmitButton = styled.button`
              flex-shrink: 0;
              padding: 10px 28px;
              border-radius: 999px;
              border: none;
              font-size: 16px;
              font-weight: 600;
              color: white;
              cursor: pointer;
              background: linear-gradient(135deg, #4b8fff, #7aa7ff);
              box-shadow: 0 14px 30px rgba(75, 143, 255, 0.4);
              transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
            
              &:hover {
                transform: translateY(-1px);
                box-shadow: 0 18px 36px rgba(75, 143, 255, 0.45);
              }
            
              &:active {
                transform: translateY(0);
                box-shadow: 0 10px 20px rgba(75, 143, 255, 0.35);
                opacity: 0.9;
              }
            `;
            
            const PresetList = styled.div`
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
            
              /* 스타일 */
              padding: 18px 25px; /* 내부 여백 */
              margin-top: 10px; /* 위쪽 여백 */
            `;
            
            const PresetChip = styled.button<{ $isSelected?: boolean }>`
              border-radius: 999px;
              border: none;
              padding: 8px 18px;
              font-size: 14px;
              background: ${({ $isSelected }) => ($isSelected ? 'linear-gradient(135deg, #4b8fff, #7aa7ff)' : 'linear-gradient(135deg, #f1f5ff, #f9fdff)')};
              color: ${({ $isSelected }) => ($isSelected ? 'white' : '#4e5e8b')};
              box-shadow: ${({ $isSelected }) => ($isSelected ? '0 14px 30px rgba(75, 143, 255, 0.45)' : '0 10px 22px rgba(124, 144, 255, 0.18)')};
              cursor: pointer;
              white-space: nowrap;
              transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.2s ease;
            
              &:hover {
                transform: translateY(-1px);
                box-shadow: ${({ $isSelected }) => ($isSelected ? '0 18px 36px rgba(75, 143, 255, 0.45)' : '0 14px 30px rgba(124, 144, 255, 0.25)')};
                background: ${({ $isSelected }) => ($isSelected ? 'linear-gradient(135deg, #4b8fff, #7aa7ff)' : 'linear-gradient(135deg, #e4edff, #f4fbff)')};
              }
            
              &:active {
                transform: translateY(0);
                box-shadow: ${({ $isSelected }) => ($isSelected ? '0 10px 20px rgba(75, 143, 255, 0.35)' : '0 8px 16px rgba(124, 144, 255, 0.2)')};
                opacity: ${({ $isSelected }) => ($isSelected ? '0.9' : '1')};
              }
            `;
            
            const HelperText = styled.p`
              margin-top: 20px;
              font-size: 14px;
              color: #7d8095;
            `;
