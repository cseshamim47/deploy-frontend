import React from 'react'

const Title = ({title,description,showText}:{title:string,description:string,showText:boolean}) => {
  return (
    <div className={`${showText && 'space-y-1'}`}>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
        {title}
      </h1>
      {showText && <p className="text-sm md:text-base lg:text-lg">{description}</p>}
    </div>
  );
}

export default Title