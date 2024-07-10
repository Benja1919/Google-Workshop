import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Path } from 'react-native-svg';
import * as shape from 'd3-shape';

const { width, height } = Dimensions.get('window');

const nodes = [
  { id: '1', name: 'User 1', x: 50, y: 50 },
  { id: '2', name: 'User 2', x: 150, y: 150 },
  { id: '3', name: 'User 3', x: 250, y: 50 },
  { id: '4', name: 'User 4', x: 350, y: 150 },
  { id: '5', name: 'User 5', x: 450, y: 50 },
];

const links = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '2', target: '4' },
  { source: '3', target: '4' },
  { source: '4', target: '5' },
];

const NetworkScreen = () => {
  const lineGenerator = shape.line()
    .curve(shape.curveBundle.beta(1));

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {links.map((link, index) => {
          const source = nodes.find(node => node.id === link.source);
          const target = nodes.find(node => node.id === link.target);
          const linePath = lineGenerator([[source.x, source.y], [target.x, target.y]]);

          return (
            <Path
              key={index}
              d={linePath}
              stroke="yellow"
              strokeWidth="2"
              fill="none"
            />
          );
        })}
        {nodes.map((node, index) => (
          <React.Fragment key={index}>
            <Circle
              cx={node.x}
              cy={node.y}
              r={20}
              fill="brown"
            />
            <SvgText
              x={node.x}
              y={node.y}
              fill="white"
              fontSize="10"
              textAnchor="middle"
              dy=".3em"
            >
              {node.name}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default NetworkScreen;
