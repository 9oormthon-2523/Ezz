/**
 * is Hover 기반 투명도 애니메이션을 사용하는 HOC
 *
 * @example
 * // HOC로 감싸기
 * const Frame = () => {return {...</div>}}
 * const AnimatedFrame = OpacityAnimation(Frame);
 * export default AnimatedFrame 
 * */

type OpacityAnimationProps = {
  isHover: boolean;
};

const OpacityAnimation = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
const AnimatedComponent = (props: P & OpacityAnimationProps) => {
  const { isHover, ...rest } = props;

  return (
      <div style={{ opacity: isHover ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        <WrappedComponent {...(rest as P)} />
      </div>
    );
  };

  AnimatedComponent.displayName = `OpacityAnimation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AnimatedComponent;
};

export default OpacityAnimation;