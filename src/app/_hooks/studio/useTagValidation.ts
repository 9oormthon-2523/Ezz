import { useEffect, useState } from 'react';
import { z } from 'zod';
import useStreamingSettings from '@/app/_store/stores/studio/useStreamingSettings';

// Zod 스키마 정의 (최대 15자, 공백 & 특수문자 제한)
const tagSchema = z
  .string()
  .min(1, '태그를 입력해주세요.')
  .max(15, '태그는 15자까지 입력 가능합니다.')
  .regex(/^[a-zA-Z0-9가-힣]+$/, '공백 및 특수 문자는 입력할 수 없습니다.');

const useTagValidation = (tags: string[]) => {
  const [text, setText] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);
  const { data, setPushTags } = useStreamingSettings();

  useEffect(() => {
    if (tags.length > 0) {
      tags.forEach((item) => {
        if (!data.tags.includes(item)) {
          setPushTags(item);
        }
      });
    }
  }, [tags, data.tags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setTagError(null); // 입력 중 오류 메시지 초기화
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Zod 검증 실행
    const validationResult = tagSchema.safeParse(text);
    if (!validationResult.success) {
      setTagError(validationResult.error.issues[0].message);
      return;
    }

    // 2. 중복 태그 검사
    if (data.tags.includes(text)) {
      setTagError('이미 등록된 태그입니다.');
      return;
    }

    // 3. 최대 5개 태그 제한
    if (data.tags.length >= 5) {
      setTagError('태그는 5개까지 등록 가능합니다.');
      return;
    }

    // 4. 모든 조건 통과 시 태그 추가
    setPushTags(text);
    setText(''); // 입력창 초기화
    setTagError(null);
  };

  return {
    data,
    text,
    tagError,
    handleInputChange,
    handleSubmit,
  };
};

export default useTagValidation;
