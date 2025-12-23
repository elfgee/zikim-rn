# ZUIX

Zigbang UI/UX

## 파일구조

### assets

Icon에 추가될 svg를 관리합니다

### components

Zuix의 컴포넌트

### libs

-   animations
-   globalStore - pub/sub store 제네레이터

### store

아래의 스토어 제공
Provider 컴포넌트 내에 디폴트로 주입되어 있다.<br/>
Zuix 에서 외부 라이브러리의 강제성을 배제하기 위하여 Pub/Sub 형태의 자체 스토어를 제공합니다.

-   dialig
-   snackbar
-   snackbarVertical
-   tooltip <br/>

### styles

web에서는 Pressable에 touchPadding을 주기위해 zuix-tp-{value} css를 제공하고있다.

### types

Zuix 내 타입과 디자인 토큰 관리

### utils

Zuix 내 공용 util 함수

### Debug

app 혹은 storybook을 사용합니다.

### Build

'yarn build' 통해 빌드합니다.<br/>
rollup과 Barrel File 구조를 사용하여 패키지를 생성합니다.

### Deploy

scripts/release.sh 를 통해 배포<br/>
배포 완료시 scripts/sendMessage.ts 를 통해 슬렉 [zuix](https://zigbang.slack.com/archives/C9JFDTQ5T) 채널에 알림을 보냅니다.

### 아이콘 추가하기

1. assets/svg 경로에 .svg 파일을 추가합니다.
2. yarn svg 커맨드를 실행합니다. svgo 기반의 svg 최적화를 수행하여 packages/zuix/src/components/icon/svg.ts 를 갱신합니다.

### 3rd dependencies

react-native-haptic-feedback
<br/> Slider 컴포넌트의 햅틱반응을 위해 사용

react-native-linear-gradient
Button, ChipFilter, Thumbnail의 그라디언트 표현에 사용

### 인터페이스 정의 가이드

1. props의 명은 컴포넌트의 디자인 토큰과 일치시킨다.(title, subtitle, badge 등...)
2. Root Element의 Props를 Extends 한다.
3. Root Element에 마진 적용을위해 Margin을 Extends 한다.
4. interface 정의시 default를 기록하여 정보를 제공한다.
5. left, top, right, bottom 은 커스텀 영역으로 예약된 property 이름입니다.
6. 레이아웃과 스페이싱에는 관여하지 않으며 margin을 통해 지원한다.(ListView는 Generating을 위해 제외)

### 컴포넌트 개발 가이드

1. ~ alias 를 활용하여 import 규칙을 지킨다.

```typescript
	/** @default 14 */
	size?: "14" | "16"
```

```typescript
import { ViewProps } from "react-native"
import { Margin } from "~/types"

export interface NoticeTextProps extends ViewProps, Margin {

    <View style={[s.root, marginStyle, style]} {...props}>
```

2. Touch 가능한 영역은 Pressable 컴포넌트를 활용한다.
3. TextType 렌더시 renderTextByProps 를 활용하여 string 혹은 textProps 혹은 JSX.Element를 지원한다.<br/>

```typescript
{
	renderTextByProps({ ...TEXT_PROPS, size, color: textColor }, text)
}
```

4. props override 시에 사용자 props가 사라지지 않도록 주의한다.

```typescript
onFocus={(e) => {
		textInputProps?.onFocus?.(e)
	}}
```

4. StyleSheet 및 순수함수는 성능 최적화를 위하여 컴포넌트 외부에 선언한다.

```typescript
const s = StyleSheet.create({
```

5. useMemo, useCallback은 가급적 사용하지 않는다.
6. 히스토리가 있는 코드에 주석을 달자.
7. scrollView 혹은 textInput 등의 ref가 필요할 경우 forwardRef를 통하여 전달한다.<br/>
   ref가 함수형으로 올 수 있는 경우 아래 코드를 참고

```typescript
const [node, setNode] = useState<Animated.SectionList<ItemT, SectionT> | null>(null)
const bindRef = useCallback(
	(ele: any) => {
		setNode(ele)
		if (typeof ref === "object" && ref !== null) ref.current = ele
		else if (typeof ref === "function") ref(ele)
	},
	[ref]
)
```
