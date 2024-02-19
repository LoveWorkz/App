const interfaceConst = 'interface';

module.exports = componentName => `import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

${interfaceConst} ${componentName}Props {}

const ${componentName} = (props: ${componentName}Props) => {
    const {} = props;
    const {t} = useTranslation();
    
    return (
     <View style={styles.${componentName}}>
        <AppText text={t('${componentName}')} size={TextSize.LEVEL_4} />
      </View>
    );
};


export default memo(${componentName});

const styles = StyleSheet.create({
    ${componentName} : {},
});`;
