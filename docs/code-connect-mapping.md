# Figma Code Connect 매핑 (진단 시작 화면용 공용 컴포넌트)

현재 레포에는 Code Connect 설정/스크립트가 없습니다. 아래 매핑을 기준으로 Figma에서 Code Connect 연결 시 파일 경로와 props를 지정하세요. (추가 라이브러리 없이 작성)

## 매핑 대상 및 파일 경로 (Design System)
- Button: `packages/zuix/src/components/button/Button.tsx`
- Input (suffix/postfix 지원): `packages/zuix/src/components/TextInput.tsx` (postfix prop 사용)
- Checkbox: `packages/zuix/src/components/Checkbox.tsx`
- SegmentedControl: `packages/zuix/src/components/SegmentedControl.tsx`
- ListItem: `packages/zuix/src/components/list/ListItem.tsx`
- ListSelectItem: `packages/zuix/src/components/list/ListSelectItem.tsx`
- RadioButton: `packages/zuix/src/components/RadioButton.tsx`

## Figma Property ↔ RN prop 매핑

### Button
- `variant` (primary | secondary) ↔ `variant`
- `disabled` (boolean) ↔ `disabled`
- `label` (text) ↔ `label`

### Input (TextInput with postfix)
- `keyboardType` (default | numeric) ↔ `keyboardType`
- `placeholder` (text) ↔ `placeholder`
- `suffixEnabled` (boolean) ↔ `postfix` 존재 여부
- `suffixText` (text) ↔ `postfix`
- `disabled` (boolean) ↔ `disabled`

### Checkbox
- `checked` (boolean) ↔ `checked`
- `label` (text) ↔ `label`
- `disabled` (boolean) ↔ `disabled`

### SegmentedControl
- `selected` (enum: opt1 | opt2 | opt3) ↔ `value` (각 option.value를 opt1/opt2/opt3로 매핑)
- `opt1Label` (text) ↔ `options[0].label`
- `opt2Label` (text) ↔ `options[1].label`
- `opt3Label` (text) ↔ `options[2].label`
- `disabled` (boolean) ↔ `disabled`

### ListItem
- `title` (text) ↔ `title`
- `subtitle1/2/3/4` (text) ↔ 동일 이름 props
- `left/right` (slot) ↔ `left` / `right`
- `tagText` (text) ↔ `tagText`
- `leftAlgin` (enum: top|center|bottom) ↔ `leftAlgin`

### ListSelectItem
- `title` (text) ↔ `title`
- `subtitle` (text) ↔ `subtitle`
- `left/right` (slot) ↔ `left` / `right`
- `onPress` (action) ↔ `onPress`

### RadioButton
- `checked` (boolean) ↔ `checked`
- `text` (text) ↔ `text`
- `size` (enum: "20" | "28") ↔ `size`
- `disabled` (boolean) ↔ `disabled`

## 사용 가이드 (예시)
1. Figma Code Connect에서 각 컴포넌트 노드를 선택 후, 위 파일 경로를 지정합니다.
2. Figma properties를 RN props에 1:1 매핑합니다. (value/onChangeText/onChange 등 런타임 데이터는 미매핑)
3. SegmentedControl은 옵션 3개 고정 시 opt1/opt2/opt3 값으로 매핑합니다.

## 현재 레포 내 Code Connect 관련 항목
- package.json 스크립트: 없음
- 기존 매핑/설정 파일: 없음
- Figma 링크 언급: `packages/zuix/src/components/Slider/Slider*.tsx`에 @figma 주석만 존재


