import * as Sentry from '@sentry/nextjs';
import type { NextPageContext } from 'next';
import type { ErrorProps } from 'next/error';
import Error from 'next/error';

const CustomErrorComponent = (props: ErrorProps) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext): Promise<ErrorProps> => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
