import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Clock } from 'lucide-react';
import { Creator } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <Link to={`/${creator.username}`}>
      <Card variant="interactive" className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={creator.photoURL} 
              alt={creator.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary" 
            />
            <div>
              <h3 className="text-xl font-bold text-light-100">{creator.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {creator.expertise.map((item, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-light-300 text-sm mb-4 flex-grow">
            {creator.bio}
          </p>
          
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-accent-blue mb-1">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{creator.followers.toLocaleString()}</span>
                </div>
                <span className="text-xs text-light-300">Followers</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center text-accent-green mb-1">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{creator.answeredQuestions}</span>
                </div>
                <span className="text-xs text-light-300">Answered</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center text-accent-pink mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{creator.responseRate}%</span>
                </div>
                <span className="text-xs text-light-300">Response</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between">
            <div>
              <span className="text-xs text-light-300">Public</span>
              <p className="text-light-100 font-bold">₹{creator.publicPrice}</p>
            </div>
            <div>
              <span className="text-xs text-light-300">Private</span>
              <p className="text-light-100 font-bold">₹{creator.privatePrice}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CreatorCard;